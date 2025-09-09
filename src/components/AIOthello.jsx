// src/components/AIOthello.jsx
import { useEffect } from "react";
import Board from "@/components/othello/Board";
import useAIGameStore from "@/stores/aiGameStore";
import { motion, AnimatePresence } from "framer-motion";

export default function AIOthello({ onBackToMenu }) {
  const {
    board,
    currentPlayer,
    validMoves,
    gameOver,
    winner,
    aiDifficulty,
    aiThinking,
    humanPlayer,
    aiPlayer,
    isHumanTurn,
    makeMove,
    resetGame,
    calculateValidMoves,
    getScores,
    getDifficultyName,
  } = useAIGameStore();

  const scores = getScores();

  // Calculate valid moves when component mounts
  useEffect(() => {
    calculateValidMoves();
  }, []);

  const handleCellClick = (row, col) => {
    if (isHumanTurn() && !aiThinking) {
      makeMove(row, col);
    }
  };

  const getWinnerText = () => {
    if (winner === 0) return "IT'S A TIE!";
    if (winner === humanPlayer) return "YOU WIN! 🎉";
    if (winner === aiPlayer) return "AI WINS! 🤖";
    return "";
  };

  const getCurrentPlayerText = () => {
    if (gameOver) return "Game Over";
    if (aiThinking) return "🤖 AI THINKING...";
    if (isHumanTurn()) return "🎯 YOUR TURN";
    return "⏳ AI'S TURN";
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-between p-4 sm:p-6 max-w-4xl mx-auto h-screen bg-slate-950 text-gray-100 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_80%)] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Header section */}
      <div className="w-full">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-wider text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        >
          COSMIC OTHELLO VS AI
        </motion.h1>

        {/* AI difficulty indicator */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="px-3 py-1 bg-slate-800 border border-cyan-900 rounded-full text-cyan-400 font-mono text-sm">
            🤖 {getDifficultyName(aiDifficulty)} AI
          </span>
        </motion.div>

        <motion.div
          className="mb-2 sm:mb-4 flex items-center justify-center gap-4 sm:gap-8 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Human Player */}
          <motion.div
            className={`flex flex-col items-center p-2 sm:p-3 rounded-lg ${
              currentPlayer === humanPlayer && !gameOver
                ? "bg-slate-800 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "bg-slate-900"
            } transition-all duration-300 w-24 sm:w-32 ring-2 ring-purple-500`}
            animate={{
              scale: currentPlayer === humanPlayer && !gameOver ? 1.05 : 1,
              y: currentPlayer === humanPlayer && !gameOver ? -5 : 0,
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 mb-1 sm:mb-2 flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-purple-400 opacity-70"></div>
            </div>
            <span className="text-purple-400 font-semibold text-xs sm:text-sm">
              YOU
            </span>
            <span className="text-purple-300 text-xs font-mono">(HUMAN)</span>
            <motion.div
              className="text-xl sm:text-2xl font-bold text-purple-300 mt-0 sm:mt-1"
              key={scores.human}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              {scores.human}
            </motion.div>
          </motion.div>

          <motion.div
            className="text-cyan-400 font-mono text-lg sm:text-xl"
            animate={{
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            VS
          </motion.div>

          {/* AI Player */}
          <motion.div
            className={`flex flex-col items-center p-2 sm:p-3 rounded-lg ${
              currentPlayer === aiPlayer && !gameOver
                ? "bg-slate-800 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-slate-900"
            } transition-all duration-300 w-24 sm:w-32 ring-2 ring-cyan-500 relative`}
            animate={{
              scale: currentPlayer === aiPlayer && !gameOver ? 1.05 : 1,
              y: currentPlayer === aiPlayer && !gameOver ? -5 : 0,
            }}
          >
            {/* AI thinking indicator */}
            {aiThinking && (
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            )}

            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-300 mb-1 sm:mb-2 flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-cyan-200 opacity-70"></div>
            </div>
            <span className="text-cyan-400 font-semibold text-xs sm:text-sm">
              AI
            </span>
            <span className="text-cyan-300 text-xs font-mono">
              ({getDifficultyName(aiDifficulty)})
            </span>
            <motion.div
              className="text-xl sm:text-2xl font-bold text-cyan-300 mt-0 sm:mt-1"
              key={scores.ai}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              {scores.ai}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Turn indicator */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentPlayer}-${aiThinking}-${gameOver}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`font-mono text-sm ${
                gameOver
                  ? "text-yellow-400"
                  : aiThinking
                  ? "text-cyan-400"
                  : isHumanTurn()
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {getCurrentPlayerText()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Main board */}
      <div className="flex-grow flex items-center justify-center w-full">
        <AIBoard
          board={board}
          validMoves={validMoves}
          onCellClick={handleCellClick}
          disabled={!isHumanTurn() || aiThinking || gameOver}
          aiThinking={aiThinking}
        />
      </div>

      {/* Footer with buttons */}
      <motion.div
        className="flex gap-4 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={resetGame}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-md font-semibold tracking-wider"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          NEW GAME
        </motion.button>

        <motion.button
          onClick={onBackToMenu}
          className="px-6 py-2 bg-slate-800 border border-cyan-900 text-cyan-400 rounded-md font-semibold tracking-wider hover:bg-slate-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          BACK TO MENU
        </motion.button>
      </motion.div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-slate-900 border-2 border-cyan-700 rounded-lg p-6 max-w-md w-full relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2),transparent_70%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.2),transparent_70%)]"></div>

              <motion.h2
                className="text-2xl sm:text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                GAME OVER
              </motion.h2>

              <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p
                  className={`text-lg sm:text-xl font-semibold ${
                    winner === 0
                      ? "text-yellow-400"
                      : winner === humanPlayer
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {getWinnerText()}
                </p>
              </motion.div>

              <motion.div
                className="flex justify-center gap-8 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 mb-2 mx-auto flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-purple-400 opacity-70"></div>
                  </div>
                  <p className="text-purple-400 font-semibold text-sm sm:text-base">
                    YOU
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-300">
                    {scores.human}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-300 mb-2 mx-auto flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-cyan-200 opacity-70"></div>
                  </div>
                  <p className="text-cyan-400 font-semibold text-sm sm:text-base">
                    AI ({getDifficultyName(aiDifficulty)})
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-cyan-300">
                    {scores.ai}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={resetGame}
                  className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-md font-semibold tracking-wider"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  PLAY AGAIN
                </motion.button>

                <motion.button
                  onClick={onBackToMenu}
                  className="flex-1 py-2 sm:py-3 bg-slate-800 border border-cyan-900 text-cyan-400 rounded-md font-semibold tracking-wider"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  BACK TO MENU
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// AI Board Component
function AIBoard({ board, validMoves, onCellClick, disabled, aiThinking }) {
  const isValidMovePosition = (row, col) => {
    return validMoves && validMoves.some(([r, c]) => r === row && c === col);
  };

  return (
    <motion.div
      className="flex flex-col items-center w-full max-w-full max-h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`grid grid-cols-8 gap-[2px] bg-slate-800 p-1 sm:p-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-900 w-full max-w-[min(60vw,60vh)] aspect-square ${
          aiThinking ? "opacity-75" : "opacity-100"
        }`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: aiThinking ? 0.75 : 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <AICell
              key={`${rowIndex}-${cellIndex}`}
              row={rowIndex}
              col={cellIndex}
              value={cell}
              isValidMove={isValidMovePosition(rowIndex, cellIndex)}
              onClick={onCellClick}
              disabled={disabled}
              aiThinking={aiThinking}
            />
          ))
        )}
      </motion.div>
    </motion.div>
  );
}

// AI Cell Component
function AICell({
  row,
  col,
  value,
  isValidMove,
  onClick,
  disabled,
  aiThinking,
}) {
  const handleClick = () => {
    if (!disabled && isValidMove && !aiThinking) {
      onClick(row, col);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`w-full h-full aspect-square flex items-center justify-center bg-slate-900 border border-cyan-900 relative rounded-md overflow-hidden ${
        !disabled && isValidMove && !aiThinking
          ? "cursor-pointer"
          : "cursor-default"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: (row + col) * 0.02 }}
      whileHover={{
        boxShadow:
          !disabled && isValidMove && !aiThinking
            ? "0 0 8px 2px rgba(6, 182, 212, 0.7)"
            : "none",
        scale: !disabled && isValidMove && !aiThinking ? 1.05 : 1,
      }}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:10px_10px]"></div>

      {/* Game piece */}
      <AnimatePresence mode="wait">
        {value !== 0 && (
          <motion.div
            key={`piece-${row}-${col}-${value}`}
            initial={{ scale: 0, rotateY: 0 }}
            animate={{ scale: 1, rotateY: 360 }}
            exit={{ scale: 0, rotateY: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className={`w-[70%] h-[70%] rounded-full flex items-center justify-center ${
              value === 1
                ? "bg-gradient-to-br from-purple-900 to-purple-600"
                : "bg-gradient-to-br from-cyan-500 to-cyan-300"
            } z-10`}
          >
            {/* Inner ring */}
            <div
              className={`w-[60%] h-[60%] rounded-full border-2 ${
                value === 1 ? "border-purple-400" : "border-cyan-200"
              } opacity-70`}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Valid move indicator */}
      <AnimatePresence>
        {!disabled && isValidMove && value === 0 && !aiThinking && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 1.5,
            }}
            className="w-[20%] h-[20%] rounded-full bg-cyan-400 absolute z-10"
          />
        )}
      </AnimatePresence>

      {/* Cell highlight effect */}
      {!disabled && isValidMove && !aiThinking && (
        <motion.div
          className="absolute inset-0 bg-cyan-500 opacity-10 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Disabled overlay */}
      {(disabled || aiThinking) && (
        <div className="absolute inset-0 bg-slate-900/50 z-20"></div>
      )}
    </motion.div>
  );
}
