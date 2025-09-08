// src/App.jsx
import React from "react";
import MainMenu from "./components/MainMenu";
import Lobby from "./components/Lobby";
import WaitingRoom from "./components/WaitingRoom";
import OnlineOthello from "./components/OnlineOthello";
import Othello from "./pages/Othello"; // Your original local game
import useOnlineGameStore from "./stores/onlineGameStore";

function App() {
  const gameState = useOnlineGameStore((state) => state.gameState);

  // Handle routing based on URL (simple routing)
  const currentPath = window.location.pathname;

  // Local game route
  if (currentPath === "/local") {
    return (
      <div>
        <Othello />
      </div>
    );
  }

  // Online game routing based on game state
  switch (gameState) {
    case "lobby":
      return <Lobby />;
    case "waiting":
      return <WaitingRoom />;
    case "playing":
      return <OnlineOthello />;
    default:
      return <MainMenu />;
  }
}

export default App;
