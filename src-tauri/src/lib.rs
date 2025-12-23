use futures_util::lock::Mutex;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager, State};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
struct ConnectionState {
    lua_socket: Arc<Mutex<Option<tokio::net::tcp::OwnedWriteHalf>>>,
}

#[tauri::command]
async fn send_to_game(message: String, state: State<'_, ConnectionState>) -> Result<(), String> {
    let mut socket_guard = state.lua_socket.lock().await;

    if let Some(socket) = socket_guard.as_mut() {
        socket
            .write_all(message.as_bytes())
            .await
            .map_err(|e| e.to_string())?;
        socket.write_all(b"\n").await.map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err("No connection from game!".into())
    }
}

async fn start_tcp_server(
    app_handle: AppHandle,
    state: Arc<Mutex<Option<tokio::net::tcp::OwnedWriteHalf>>>,
) {
    let addr = "127.0.0.1:9003";
    let listener = TcpListener::bind(addr).await.expect("Gagal pasang port");
    println!("Server TCP active on: {}", addr);

    loop {
        if let Ok((socket, addr)) = listener.accept().await {
            println!(">>> Client Connected: {}", addr);

            let (mut read_half, write_half) = socket.into_split();

            {
                let mut s = state.lock().await;
                *s = Some(write_half);
            }

            let handle = app_handle.clone();
            tokio::spawn(async move {
                let mut buf = [0; 1024];
                loop {
                    match read_half.read(&mut buf).await {
                        Ok(0) => {
                            println!(">>> Client disconnected");
                            break;
                        }
                        Ok(n) => {
                            let received = String::from_utf8_lossy(&buf[..n]).to_string();
                            println!("Data masuk: {:?}", received);
                            let _ = handle.emit("message_from_game", received);
                        }
                        Err(e) => {
                            println!(">>> Error Socket: {}", e);
                            break;
                        }
                    }
                }
            });
        }
    }
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let shared_socket = Arc::new(Mutex::new(None));
    let socket_for_server = shared_socket.clone();

    tauri::Builder::default()
        .manage(ConnectionState {
            lua_socket: shared_socket,
        })
        .invoke_handler(tauri::generate_handler![send_to_game])
        .setup(move |app| {
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(start_tcp_server(handle, socket_for_server));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
