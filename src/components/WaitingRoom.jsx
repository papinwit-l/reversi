// src/components/WaitingRoom.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useOnlineGameStore from "@/stores/onlineGameStore";

export default function WaitingRoom() {
  const { roomId, players, playerName, leaveRoom, getMyPlayer, getOpponent } =
    useOnlineGameStore();

  const myPlayer = getMyPlayer();
  const opponent = getOpponent();
  const isHost = myPlayer?.name === players[0]?.name;

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy room ID:", err);
    }
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
        className="max-w-2xl w-full space-y-8"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
      >
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-wider">
            WAITING ROOM
          </h1>
          <motion.div
            className="flex items-center justify-center gap-2 mt-4"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-gray-400 font-mono text-sm">Room ID:</span>
            <button
              onClick={copyRoomId}
              className="px-3 py-1 bg-slate-800 border border-cyan-900 rounded-md font-mono text-cyan-400 hover:bg-slate-700 transition-all duration-300"
              title="Click to copy"
            >
              #{roomId?.slice(-6).toUpperCase()}
            </button>
          </motion.div>
        </motion.div>

        {/* Players section */}
        <motion.div
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-900/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-cyan-400 mb-6 text-center">
            COSMIC WARRIORS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player 1 (Host) */}
            <motion.div
              className={`flex flex-col items-center p-6 rounded-lg border-2 ${
                myPlayer?.name === players[0]?.name
                  ? "bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "bg-slate-800/50 border-slate-700"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 mb-4 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-purple-400 opacity-70"></div>
              </div>

              <h3 className="text-lg font-semibold text-purple-400 mb-1">
                PLAYER 1
              </h3>

              <p className="text-white font-mono">
                {players[0]?.name || "Waiting..."}
              </p>

              {isHost && (
                <span className="mt-2 px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full font-mono">
                  HOST
                </span>
              )}

              {myPlayer?.name === players[0]?.name && (
                <span className="mt-1 px-2 py-1 bg-cyan-900/50 text-cyan-300 text-xs rounded-full font-mono">
                  YOU
                </span>
              )}
            </motion.div>

            {/* Player 2 */}
            <motion.div
              className={`flex flex-col items-center p-6 rounded-lg border-2 ${
                players.length > 1 && myPlayer?.name === players[1]?.name
                  ? "bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "bg-slate-800/50 border-slate-700"
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-300 mb-4 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-200 opacity-70"></div>
              </div>

              <h3 className="text-lg font-semibold text-cyan-400 mb-1">
                PLAYER 2
              </h3>

              <AnimatePresence mode="wait">
                {players.length > 1 ? (
                  <motion.p
                    key="player2-name"
                    className="text-white font-mono"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {players[1]?.name}
                  </motion.p>
                ) : (
                  <motion.div
                    key="waiting"
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-gray-400 font-mono mb-2">Waiting...</p>
                    <motion.div
                      className="flex space-x-1"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {players.length > 1 && myPlayer?.name === players[1]?.name && (
                <span className="mt-2 px-2 py-1 bg-cyan-900/50 text-cyan-300 text-xs rounded-full font-mono">
                  YOU
                </span>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Status message */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {players.length < 2 ? (
              <motion.div
                key="waiting-message"
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-cyan-400 font-mono text-lg">
                  🌟 Waiting for another player to join...
                </p>
                <p className="text-gray-500 text-sm">
                  Share the room ID with a friend!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="ready-message"
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-green-400 font-mono text-lg">
                  ⚡ All players ready! Game starting...
                </p>
                <motion.div
                  className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={leaveRoom}
            className="px-8 py-3 bg-slate-800 border border-red-700 text-red-400 rounded-lg font-semibold tracking-wider hover:bg-red-900/20 hover:border-red-600 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            LEAVE ROOM
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Floating cosmic elements */}
      <motion.div
        className="absolute top-20 left-16 w-12 h-12 rounded-full bg-gradient-to-br from-purple-900/30 to-purple-600/30 blur-sm"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-32 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-300/30 blur-sm"
        animate={{
          y: [0, 15, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 left-8 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 blur-sm"
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
          scale: [1, 1.2, 1],
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
