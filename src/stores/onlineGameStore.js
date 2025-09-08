// src/stores/onlineGameStore.js
import { create } from "zustand";
import socketService from "@/services/socket";

const useOnlineGameStore = create((set, get) => ({
  // Connection state
  isConnected: false,

  // Game state
  gameState: "menu", // 'menu', 'lobby', 'waiting', 'playing'
  playerName: "",
  roomId: null,
  players: [],
  myPlayerId: null,
  myPlayerNumber: null, // 1 or 2

  // Game data
  board: null,
  currentPlayer: 1,
  validMoves: [],
  gameOver: false,
  winner: 0,

  // Lobby state
  availableRooms: [],

  // UI state
  isCreatingRoom: false,
  isJoiningRoom: false,
  error: null,

  // Actions
  setPlayerName: (name) => {
    set({ playerName: name });
  },

  connectToServer: () => {
    socketService.connect();

    // Set up event listeners
    socketService.onRoomCreated((data) => {
      set({
        roomId: data.roomId,
        gameState: "waiting",
        players: [data.player],
        myPlayerId: data.player.id,
        myPlayerNumber: 1,
        isCreatingRoom: false,
        error: null,
      });
    });

    socketService.onRoomJoined((data) => {
      set({
        roomId: data.roomId,
        gameState: data.gameStarted ? "playing" : "waiting",
        players: data.players,
        myPlayerId: data.myPlayerId,
        myPlayerNumber: data.myPlayerNumber,
        board: data.gameState?.board || null,
        currentPlayer: data.gameState?.currentPlayer || 1,
        validMoves: data.gameState?.validMoves || [],
        isJoiningRoom: false,
        error: null,
      });
    });

    socketService.onPlayerJoined((data) => {
      set({
        players: data.players,
        gameState: data.gameStarted ? "playing" : "waiting",
      });
    });

    socketService.onPlayerLeft((data) => {
      set({
        players: data.players,
        gameState: data.players.length < 2 ? "waiting" : get().gameState,
      });
    });

    socketService.onGameStateUpdate((data) => {
      set({
        board: data.board,
        currentPlayer: data.currentPlayer,
        validMoves: data.validMoves,
        gameOver: data.gameOver,
        winner: data.winner,
        gameState: "playing",
      });
    });

    socketService.onGameReset((data) => {
      set({
        board: data.board,
        currentPlayer: data.currentPlayer,
        validMoves: data.validMoves,
        gameOver: false,
        winner: 0,
      });
    });

    socketService.onRoomList((data) => {
      set({ availableRooms: data.rooms });
    });

    socketService.onError((data) => {
      set({
        error: data.message,
        isCreatingRoom: false,
        isJoiningRoom: false,
      });
    });

    socketService.getSocket().on("connect", () => {
      set({ isConnected: true });
    });

    socketService.getSocket().on("disconnect", () => {
      set({ isConnected: false });
    });
  },

  disconnectFromServer: () => {
    socketService.disconnect();
    set({
      isConnected: false,
      gameState: "menu",
      roomId: null,
      players: [],
      myPlayerId: null,
      myPlayerNumber: null,
      board: null,
      availableRooms: [],
    });
  },

  createRoom: () => {
    const { playerName } = get();
    if (!playerName.trim()) {
      set({ error: "Please enter a player name" });
      return;
    }

    set({ isCreatingRoom: true, error: null });
    socketService.createRoom(playerName.trim());
  },

  joinRoom: (roomId) => {
    const { playerName } = get();
    if (!playerName.trim()) {
      set({ error: "Please enter a player name" });
      return;
    }

    set({ isJoiningRoom: true, error: null });
    socketService.joinRoom(roomId, playerName.trim());
  },

  leaveRoom: () => {
    socketService.leaveRoom();
    set({
      gameState: "lobby",
      roomId: null,
      players: [],
      myPlayerId: null,
      myPlayerNumber: null,
      board: null,
      currentPlayer: 1,
      validMoves: [],
      gameOver: false,
      winner: 0,
    });
  },

  makeMove: (row, col) => {
    const { myPlayerNumber, currentPlayer, gameOver } = get();

    // Check if it's the player's turn
    if (gameOver || myPlayerNumber !== currentPlayer) {
      return;
    }

    socketService.makeMove(row, col);
  },

  resetGame: () => {
    socketService.resetGame();
  },

  goToLobby: () => {
    set({ gameState: "lobby" });
  },

  goToMenu: () => {
    get().disconnectFromServer();
    set({ gameState: "menu" });
  },

  clearError: () => {
    set({ error: null });
  },

  // Helper functions
  isMyTurn: () => {
    const { myPlayerNumber, currentPlayer, gameOver } = get();
    return !gameOver && myPlayerNumber === currentPlayer;
  },

  getMyPlayer: () => {
    const { players, myPlayerId } = get();
    return players.find((p) => p.id === myPlayerId);
  },

  getOpponent: () => {
    const { players, myPlayerId } = get();
    return players.find((p) => p.id !== myPlayerId);
  },
}));

export default useOnlineGameStore;
