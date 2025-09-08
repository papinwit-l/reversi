// src/components/Lobby.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useOnlineGameStore from "@/stores/onlineGameStore";

export default function Lobby() {
  const {
    playerName,
    availableRooms,
    isCreatingRoom,
    isJoiningRoom,
    error,
    createRoom,
    joinRoom,
    goToMenu,
    clearError,
  } = useOnlineGameStore();

  useEffect(() => {
    // Request room list when entering lobby
    // This would be handled by the socket connection
  }, []);

  const handleCreateRoom = () => {
    createRoom();
  };

  const handleJoinRoom = (roomId) => {
    joinRoom(roomId);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-gray-100 relative overflow-hidden p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background effects */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_80%)] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Main content */}
      <motion.div
        className="max-w-4xl w-full space-y-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-wider">
            COSMIC LOBBY
          </h1>
          <p className="text-cyan-400/70 text-sm font-mono">
            Welcome,{" "}
            <span className="text-white font-semibold">{playerName}</span>
          </p>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-red-400 text-sm font-mono">{error}</p>
              <button
                onClick={clearError}
                className="mt-2 text-red-300 hover:text-red-100 text-xs underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleCreateRoom}
            disabled={isCreatingRoom}
            className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-lg font-semibold tracking-wider text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{
              scale: isCreatingRoom ? 1 : 1.02,
              boxShadow: isCreatingRoom
                ? "none"
                : "0 0 20px rgba(6, 182, 212, 0.4)",
            }}
            whileTap={{ scale: isCreatingRoom ? 1 : 0.98 }}
          >
            {isCreatingRoom ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                CREATING...
              </span>
            ) : (
              "🚀 CREATE ROOM"
            )}
          </motion.button>

          <motion.button
            onClick={goToMenu}
            className="flex-1 sm:flex-none sm:px-8 py-4 bg-slate-800 border border-cyan-900 text-cyan-400 rounded-lg font-semibold tracking-wider hover:bg-slate-700 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ← BACK TO MENU
          </motion.button>
        </motion.div>

        {/* Available rooms */}
        <motion.div
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-900/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <span>🌌</span> AVAILABLE ROOMS
          </h2>

          <AnimatePresence mode="wait">
            {availableRooms.length === 0 ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-4xl mb-2">🚀</div>
                <p className="text-gray-400 font-mono">No rooms available</p>
                <p className="text-gray-500 text-sm mt-1">
                  Create a room to start playing!
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="grid gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {availableRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-cyan-900/30 hover:border-cyan-700 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-white">
                          Room #{room.id.slice(-6).toUpperCase()}
                        </h3>
                        <span className="px-2 py-1 bg-cyan-900/30 text-cyan-400 text-xs rounded-full font-mono">
                          {room.players.length}/2 PLAYERS
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Host: {room.host}</span>
                        {room.players.length > 1 && (
                          <span>
                            vs{" "}
                            {
                              room.players.find((p) => p.name !== room.host)
                                ?.name
                            }
                          </span>
                        )}
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={isJoiningRoom || room.players.length >= 2}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      whileHover={{
                        scale:
                          isJoiningRoom || room.players.length >= 2 ? 1 : 1.05,
                        boxShadow:
                          isJoiningRoom || room.players.length >= 2
                            ? "none"
                            : "0 0 15px rgba(168, 85, 247, 0.4)",
                      }}
                      whileTap={{
                        scale:
                          isJoiningRoom || room.players.length >= 2 ? 1 : 0.95,
                      }}
                    >
                      {isJoiningRoom ? (
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          JOINING...
                        </span>
                      ) : room.players.length >= 2 ? (
                        "FULL"
                      ) : (
                        "JOIN"
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="text-center text-gray-500 text-sm font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Create or join a room to start your cosmic battle
        </motion.div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-32 right-20 w-20 h-20 rounded-full bg-gradient-to-br from-purple-900/20 to-purple-600/20 blur-sm"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
