"use client";
import { useEffect } from "react";
import Board from "@/components/othello/Board";
import useGameStore from "@/stores/gameStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Othello() {
  const currentPlayer = useGameStore((state) => state.currentPlayer);
  const resetGame = useGameStore((state) => state.resetGame);
  const validMoves = useGameStore((state) => state.validMoves || []);
  const calculateValidMoves = useGameStore(
    (state) => state.calculateValidMoves
  );
  const board = useGameStore((state) => state.board);
  const gameOver = useGameStore((state) => state.gameOver);
  const winner = useGameStore((state) => state.winner);
  const skipTurn = useGameStore((state) => state.skipTurn);

  // Calculate scores
  const scores = board.reduce(
    (acc, row) => {
      row.forEach((cell) => {
        if (cell === 1) acc.purple++;
        if (cell === 2) acc.cyan++;
      });
      return acc;
    },
    { purple: 0, cyan: 0 }
  );

  // Calculate valid moves when the component mounts
  useEffect(() => {
    if (calculateValidMoves) {
      calculateValidMoves();
    }
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center p-8 max-w-4xl mx-auto min-h-screen bg-slate-950 text-gray-100 relative"
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

      <motion.h1
        className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-wider"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
      >
        COSMIC OTHELLO
      </motion.h1>

      <motion.div
        className="mb-8 flex items-center justify-center gap-8 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          className={`flex flex-col items-center p-4 rounded-lg ${
            currentPlayer === 1 && !gameOver
              ? "bg-slate-800 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              : "bg-slate-900"
          } transition-all duration-300 w-36`}
          animate={{
            scale: currentPlayer === 1 && !gameOver ? 1.05 : 1,
            y: currentPlayer === 1 && !gameOver ? -5 : 0,
          }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 mb-2 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-purple-400 opacity-70"></div>
          </div>
          <span className="text-purple-400 font-semibold">PURPLE</span>
          <motion.div
            className="text-2xl font-bold text-purple-300 mt-1"
            key={scores.purple}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            {scores.purple}
          </motion.div>
        </motion.div>

        <motion.div
          className="text-cyan-400 font-mono text-xl"
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

        <motion.div
          className={`flex flex-col items-center p-4 rounded-lg ${
            currentPlayer === 2 && !gameOver
              ? "bg-slate-800 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              : "bg-slate-900"
          } transition-all duration-300 w-36`}
          animate={{
            scale: currentPlayer === 2 && !gameOver ? 1.05 : 1,
            y: currentPlayer === 2 && !gameOver ? -5 : 0,
          }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-300 mb-2 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-cyan-200 opacity-70"></div>
          </div>
          <span className="text-cyan-400 font-semibold">CYAN</span>
          <motion.div
            className="text-2xl font-bold text-cyan-300 mt-1"
            key={scores.cyan}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            {scores.cyan}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Skip turn notification */}
      <AnimatePresence>
        {skipTurn && (
          <motion.div
            className="text-lg mb-6 font-mono text-center bg-slate-800 p-3 rounded-md border border-cyan-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-yellow-400">TURN SKIPPED: </span>
            <span className="text-gray-300">
              {currentPlayer === 1 ? "CYAN" : "PURPLE"} HAS NO VALID MOVES
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* <motion.div
        className="text-lg mb-6 font-mono text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-gray-400">CURRENT PLAYER: </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentPlayer}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={
              currentPlayer === 1 ? "text-purple-400" : "text-cyan-400"
            }
          >
            {currentPlayer === 1 ? "PURPLE" : "CYAN"}
          </motion.span>
        </AnimatePresence>
        <div className="text-sm mt-1 text-gray-500">
          <span>VALID MOVES: </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={validMoves.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {validMoves ? validMoves.length : 0}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div> */}

      <Board />

      <motion.button
        onClick={resetGame}
        className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-md font-semibold tracking-wider"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)",
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        RESET GAME
      </motion.button>

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
              className="bg-slate-900 border-2 border-cyan-700 rounded-lg p-8 max-w-md w-full relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Background effects */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2),transparent_70%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.2),transparent_70%)]"></div>

              <motion.h2
                className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                GAME OVER
              </motion.h2>

              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {winner === 0 ? (
                  <p className="text-xl text-yellow-400 font-semibold">
                    IT'S A TIE!
                  </p>
                ) : (
                  <p className="text-xl font-semibold">
                    <span
                      className={
                        winner === 1 ? "text-purple-400" : "text-cyan-400"
                      }
                    >
                      {winner === 1 ? "PURPLE" : "CYAN"}
                    </span>{" "}
                    WINS!
                  </p>
                )}
              </motion.div>

              <motion.div
                className="flex justify-center gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 mb-2 mx-auto flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border-2 border-purple-400 opacity-70"></div>
                  </div>
                  <p className="text-purple-400 font-semibold">PURPLE</p>
                  <p className="text-2xl font-bold text-purple-300">
                    {scores.purple}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-300 mb-2 mx-auto flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border-2 border-cyan-200 opacity-70"></div>
                  </div>
                  <p className="text-cyan-400 font-semibold">CYAN</p>
                  <p className="text-2xl font-bold text-cyan-300">
                    {scores.cyan}
                  </p>
                </div>
              </motion.div>

              <motion.button
                onClick={resetGame}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-md font-semibold tracking-wider"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                PLAY AGAIN
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
