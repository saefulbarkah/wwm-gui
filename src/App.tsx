import { Button } from "./components/ui/button";
import { useSocket } from "./hooks/useSocket";

export const App = () => {
  const socket = useSocket();
  return (
    <div>
      <Button
        onClick={() => {
          socket.setInputMessage("Hi From frontend");
          socket.Send();
        }}
      >
        SEND MESSAGE
      </Button>
    </div>
  );
};
