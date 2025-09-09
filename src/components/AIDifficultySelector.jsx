// src/components/AIDifficultySelector.jsx
import React from "react";
import { motion } from "framer-motion";
import useAIGameStore from "@/stores/aiGameStore";

export default function AIDifficultySelector({ onStartGame, onBack }) {
  const { aiDifficulty, setAIDifficulty } = useAIGameStore();

  const difficulties = [
    {
      id: "easy",
      name: "EASY",
      description: "Casual play, makes some random moves",
      icon: "🌱",
      color: "from-green-600 to-green-500",
      borderColor: "border-green-500",
      shadowColor: "rgba(34, 197, 94, 0.4)",
    },
    {
      id: "medium",
      name: "MEDIUM",
      description: "Balanced strategy, good for practice",
      icon: "⚡",
      color: "from-yellow-600 to-yellow-500",
      borderColor: "border-yellow-500",
      shadowColor: "rgba(234, 179, 8, 0.4)",
    },
    {
      id: "hard",
      name: "HARD",
      description: "Advanced AI, thinks several moves ahead",
      icon: "🔥",
      color: "from-red-600 to-red-500",
      borderColor: "border-red-500",
      shadowColor: "rgba(239, 68, 68, 0.4)",
    },
  ];

  const handleDifficultySelect = (difficulty) => {
    setAIDifficulty(difficulty);
  };

  const handleStartGame = () => {
    onStartGame();
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
            VS AI MODE
          </h1>
          <p className="text-cyan-400/70 text-sm font-mono">
            Choose your opponent's difficulty level
          </p>
        </motion.div>

        {/* Difficulty options */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {difficulties.map((diff, index) => (
            <motion.div
              key={diff.id}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                aiDifficulty === diff.id
                  ? `${diff.borderColor} bg-slate-800/50 shadow-[0_0_20px_${diff.shadowColor}]`
                  : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
              }`}
              onClick={() => handleDifficultySelect(diff.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{diff.icon}</div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {diff.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-mono">
                    {diff.description}
                  </p>
                </div>

                {aiDifficulty === diff.id && (
                  <motion.div
                    className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </motion.div>
                )}
              </div>

              {aiDifficulty === diff.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-purple-600/10 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={handleStartGame}
            className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg font-semibold tracking-wider text-lg transition-all duration-300"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            🚀 START BATTLE
          </motion.button>

          <motion.button
            onClick={onBack}
            className="flex-1 sm:flex-none sm:px-8 py-4 bg-slate-800 border border-cyan-900 text-cyan-400 rounded-lg font-semibold tracking-wider hover:bg-slate-700 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ← BACK
          </motion.button>
        </motion.div>

        {/* AI info */}
        <motion.div
          className="text-center text-gray-500 text-sm font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>You play as PURPLE • AI plays as CYAN</p>
          <p className="mt-1">
            Selected: {difficulties.find((d) => d.id === aiDifficulty)?.name} AI
          </p>
        </motion.div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-16 w-16 h-16 rounded-full bg-gradient-to-br from-purple-900/30 to-purple-600/30 blur-sm"
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
        className="absolute bottom-32 right-20 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-300/30 blur-sm"
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
