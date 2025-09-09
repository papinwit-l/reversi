// src/services/socket.js
import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    // Update this URL to match your backend server
    this.socket = io(import.meta.env.VITE_API_URL || "http://localhost:9000");

    this.socket.on("connect", () => {
      console.log("Connected to server");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Game events
  createRoom(playerName) {
    this.socket?.emit("create-room", { playerName });
  }

  joinRoom(roomId, playerName) {
    this.socket?.emit("join-room", { roomId, playerName });
  }

  leaveRoom() {
    this.socket?.emit("leave-room");
  }

  makeMove(row, col) {
    this.socket?.emit("make-move", { row, col });
  }

  resetGame() {
    this.socket?.emit("reset-game");
  }

  // Event listeners
  onRoomCreated(callback) {
    this.socket?.on("room-created", callback);
  }

  onRoomJoined(callback) {
    this.socket?.on("room-joined", callback);
  }

  onPlayerJoined(callback) {
    this.socket?.on("player-joined", callback);
  }

  onPlayerLeft(callback) {
    this.socket?.on("player-left", callback);
  }

  onGameStateUpdate(callback) {
    this.socket?.on("game-state-update", callback);
  }

  onMoveResult(callback) {
    this.socket?.on("move-result", callback);
  }

  onGameReset(callback) {
    this.socket?.on("game-reset", callback);
  }

  onError(callback) {
    this.socket?.on("error", callback);
  }

  onRoomList(callback) {
    this.socket?.on("room-list", callback);
  }

  // Remove event listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
