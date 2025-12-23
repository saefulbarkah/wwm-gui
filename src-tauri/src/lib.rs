use futures_util::lock::Mutex;
use ini::Ini;
use std::fs;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager, State};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener; // Pastikan ini ada di paling atas

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "PascalCase")] // Agar cocok dengan "WorldSpeed" di React
pub struct AppConfig {
    pub world_speed: bool,
    pub world_speed_value: f64,
    pub god_mode: bool,
    pub infinite_stamina: bool,
    pub auto_heal: bool,
    pub one_hit_kill: bool,
    pub kill_aura: bool,
    pub auto_loot: bool,
    pub multiply_damage: bool,
    pub multi_damage_value: f64,

    // Untuk Buffs yang UPPER_SNAKE_CASE, kita rename manual per field
    #[serde(rename = "ENHANCE")]
    pub enhance: bool,
    #[serde(rename = "DAMAGE_UP")]
    pub damage_up: bool,
    #[serde(rename = "DEFENSE_UP")]
    pub defense_up: bool,
    #[serde(rename = "INVINCIBLE")]
    pub invincible: bool,
    #[serde(rename = "DUMB_ENEMIES")]
    pub dumb_enemies: bool,
    #[serde(rename = "BLOCK_SHIELD")]
    pub block_shield: bool,
    #[serde(rename = "IMMUNE_CONTROL")]
    pub immune_control: bool,
    #[serde(rename = "RESURRECT_VIP")]
    pub resurrect_vip: bool,
    #[serde(rename = "SUPER_VIP2")]
    pub super_vip2: bool,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            world_speed: false,
            world_speed_value: 1.0,
            god_mode: false,
            infinite_stamina: false,
            auto_heal: false,
            one_hit_kill: false,
            kill_aura: false,
            auto_loot: false,
            multiply_damage: false,
            multi_damage_value: 0.0,
            enhance: false,
            damage_up: false,
            defense_up: false,
            invincible: false,
            dumb_enemies: false,
            block_shield: false,
            immune_control: false,
            resurrect_vip: false,
            super_vip2: false,
        }
    }
}

struct ConnectionState {
    lua_socket: Arc<Mutex<Option<tokio::net::tcp::OwnedWriteHalf>>>,
}

#[tauri::command]
async fn save_config(handle: AppHandle, config: AppConfig) -> Result<(), String> {
    let config_dir = handle.path().app_config_dir().map_err(|e| e.to_string())?;

    if !config_dir.exists() {
        fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    }

    let file_path = config_dir.join("wwm.ini");

    let mut conf = Ini::new();
    let section = "Features";

    conf.with_section(Some(section))
        .set("WorldSpeed", config.world_speed.to_string())
        .set("WorldSpeedValue", config.world_speed_value.to_string())
        .set("GodMode", config.god_mode.to_string())
        .set("InfiniteStamina", config.infinite_stamina.to_string())
        .set("AutoHeal", config.auto_heal.to_string())
        .set("OneHitKill", config.one_hit_kill.to_string())
        .set("KillAura", config.kill_aura.to_string())
        .set("AutoLoot", config.auto_loot.to_string())
        .set("MultiplyDamage", config.multiply_damage.to_string())
        .set("MultiDamageValue", config.multi_damage_value.to_string())
        .set("ENHANCE", config.enhance.to_string())
        .set("DAMAGE_UP", config.damage_up.to_string())
        .set("DEFENSE_UP", config.defense_up.to_string())
        .set("INVINCIBLE", config.invincible.to_string())
        .set("DUMB_ENEMIES", config.dumb_enemies.to_string())
        .set("BLOCK_SHIELD", config.block_shield.to_string())
        .set("IMMUNE_CONTROL", config.immune_control.to_string())
        .set("RESURRECT_VIP", config.resurrect_vip.to_string())
        .set("SUPER_VIP2", config.super_vip2.to_string());

    // PERBAIKAN: Tambahkan tipe eksplisit std::io::Error di sini
    conf.write_to_file(file_path)
        .map_err(|e: std::io::Error| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn load_config(handle: AppHandle) -> Result<AppConfig, String> {
    let mut path = handle.path().app_config_dir().map_err(|e| e.to_string())?;
    path.push("wwm.ini");

    if !path.exists() {
        return Ok(AppConfig::default());
    }

    // PERBAIKAN: Tambahkan tipe eksplisit ini::Error di sini
    let conf = Ini::load_from_file(path).map_err(|e: ini::Error| e.to_string())?;
    let section = conf.section(Some("Features")).ok_or("Section not found")?;

    let get_bool = |key: &str| {
        section
            .get(key)
            .and_then(|v: &str| v.parse::<bool>().ok())
            .unwrap_or(false)
    };

    let get_f64 = |key: &str| {
        section
            .get(key)
            .and_then(|v: &str| v.parse::<f64>().ok())
            .unwrap_or(0.0)
    };

    Ok(AppConfig {
        world_speed: get_bool("WorldSpeed"),
        world_speed_value: get_f64("WorldSpeedValue"),
        god_mode: get_bool("GodMode"),
        infinite_stamina: get_bool("InfiniteStamina"),
        auto_heal: get_bool("AutoHeal"),
        one_hit_kill: get_bool("OneHitKill"),
        kill_aura: get_bool("KillAura"),
        auto_loot: get_bool("AutoLoot"),
        multiply_damage: get_bool("MultiplyDamage"),
        multi_damage_value: get_f64("MultiDamageValue"),
        enhance: get_bool("ENHANCE"),
        damage_up: get_bool("DAMAGE_UP"),
        defense_up: get_bool("DEFENSE_UP"),
        invincible: get_bool("INVINCIBLE"),
        dumb_enemies: get_bool("DUMB_ENEMIES"),
        block_shield: get_bool("BLOCK_SHIELD"),
        immune_control: get_bool("IMMUNE_CONTROL"),
        resurrect_vip: get_bool("RESURRECT_VIP"),
        super_vip2: get_bool("SUPER_VIP2"),
    })
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
            let _ = app_handle.emit("connection-status", "connected");
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
                            let _ = handle.emit("connection-status", "disconnected");
                            println!(">>> Client disconnected");
                            break;
                        }
                        Ok(n) => {
                            let received = String::from_utf8_lossy(&buf[..n]).to_string();
                            println!("Data masuk: {:?}", received);
                            let _ = handle.emit("message_from_game", received);
                        }
                        Err(e) => {
                            let _ = handle.emit("connection-status", "disconnected");
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
        .invoke_handler(tauri::generate_handler![
            send_to_game,
            save_config,
            load_config
        ])
        .setup(move |app| {
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(start_tcp_server(handle, socket_for_server));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
