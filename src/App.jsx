// src/App.jsx
import React, { useState } from "react";
import MainMenu from "./components/MainMenu";
import Lobby from "./components/Lobby";
import WaitingRoom from "./components/WaitingRoom";
import OnlineOthello from "./components/OnlineOthello";
import AIDifficultySelector from "./components/AIDifficultySelector";
import AIOthello from "./components/AIOthello";
import Othello from "./components/Othello"; // Your original local game
import useOnlineGameStore from "./stores/onlineGameStore";

function App() {
  const [gameMode, setGameMode] = useState("menu"); // 'menu', 'vsai', 'ai-game', 'local', 'online'
  const onlineGameState = useOnlineGameStore((state) => state.gameState);
  const { setPlayerName, connectToServer, goToLobby } = useOnlineGameStore();

  // Handle different game modes
  const handleVSAI = () => {
    setGameMode("vsai");
  };

  const handleStartAIGame = () => {
    setGameMode("ai-game");
  };

  const handleLocalPlay = () => {
    setGameMode("local");
  };

  const handleOnlinePlay = (playerName) => {
    setPlayerName(playerName);
    connectToServer();
    goToLobby();
    setGameMode("online");
  };

  const handleBackToMenu = () => {
    setGameMode("menu");
    // Reset online game state if needed
    const { goToMenu } = useOnlineGameStore.getState();
    goToMenu();
  };

  // Handle routing based on current mode
  switch (gameMode) {
    case "vsai":
      return (
        <AIDifficultySelector
          onStartGame={handleStartAIGame}
          onBack={handleBackToMenu}
        />
      );

    case "ai-game":
      return <AIOthello onBackToMenu={handleBackToMenu} />;

    case "local":
      return (
        <div>
          <Othello />
          {/* Add a back button overlay if needed */}
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={handleBackToMenu}
              className="px-4 py-2 bg-slate-800 border border-cyan-900 text-cyan-400 rounded-lg font-semibold hover:bg-slate-700 transition-all duration-300"
            >
              ← BACK TO MENU
            </button>
          </div>
        </div>
      );

    case "online":
      // Online game routing based on online game state
      switch (onlineGameState) {
        case "lobby":
          return <Lobby />;
        case "waiting":
          return <WaitingRoom />;
        case "playing":
          return <OnlineOthello />;
        default:
          // If online game state is 'menu', go back to main menu
          setGameMode("menu");
          return (
            <MainMenu
              onVSAI={handleVSAI}
              onLocalPlay={handleLocalPlay}
              onOnlinePlay={handleOnlinePlay}
            />
          );
      }

    default:
      return (
        <MainMenu
          onVSAI={handleVSAI}
          onLocalPlay={handleLocalPlay}
          onOnlinePlay={handleOnlinePlay}
        />
      );
  }
}

export default App;
