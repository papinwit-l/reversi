// src/components/MainMenu.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import useOnlineGameStore from "@/stores/onlineGameStore";

export default function MainMenu() {
  const [playerName, setPlayerName] = useState("");
  const {
    setPlayerName: setStoreName,
    connectToServer,
    goToLobby,
    error,
    clearError,
    isConnected,
  } = useOnlineGameStore();

  const handlePlayOnline = () => {
    if (!playerName.trim()) {
      return;
    }
    setStoreName(playerName.trim());
    connectToServer();
    goToLobby();
  };

  const handleLocalPlay = () => {
    // Navigate to local game - you'll need to implement this in your main App component
    window.location.href = "/local";
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-gray-100 relative overflow-hidden p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background effects */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_80%)] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_70%)] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Main content */}
      <motion.div
        className="max-w-md w-full space-y-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-900/50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
      >
        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-wider">
            COSMIC OTHELLO
          </h1>
          <p className="text-cyan-400/70 text-sm font-mono tracking-wide">
            QUANTUM STRATEGY AWAITS
          </p>
        </motion.div>

        {/* Player name input */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-semibold text-cyan-400 mb-2">
            ENTER YOUR NAME
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              clearError();
            }}
            placeholder="Your cosmic handle..."
            className="w-full px-4 py-3 bg-slate-800 border border-cyan-900 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 font-mono"
            maxLength={20}
          />
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            className="bg-red-900/50 border border-red-700 rounded-lg p-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-400 text-sm font-mono">{error}</p>
          </motion.div>
        )}

        {/* Connection status */}
        {isConnected && (
          <motion.div
            className="bg-green-900/50 border border-green-700 rounded-lg p-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-green-400 text-sm font-mono">
              ✓ Connected to server
            </p>
          </motion.div>
        )}

        {/* Menu buttons */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handlePlayOnline}
            disabled={!playerName.trim()}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-lg font-semibold tracking-wider text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{
              scale: playerName.trim() ? 1.02 : 1,
              boxShadow: playerName.trim()
                ? "0 0 20px rgba(6, 182, 212, 0.4)"
                : "none",
            }}
            whileTap={{ scale: playerName.trim() ? 0.98 : 1 }}
          >
            🌐 PLAY ONLINE
          </motion.button>

          <motion.button
            onClick={handleLocalPlay}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-semibold tracking-wider text-lg transition-all duration-300"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            🏠 LOCAL PLAY
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center text-gray-500 text-xs font-mono pt-4 border-t border-cyan-900/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Challenge players across the cosmos
        </motion.div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-16 h-16 rounded-full bg-gradient-to-br from-purple-900/30 to-purple-600/30 blur-sm"
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
        className="absolute bottom-32 right-16 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-300/30 blur-sm"
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
    </motion.div>
  );
}
