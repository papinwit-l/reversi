// src/components/OnlineOthello.jsx
import { useEffect } from "react";
import Board from "@/components/othello/Board";
import useOnlineGameStore from "@/stores/onlineGameStore";
import { motion, AnimatePresence } from "framer-motion";

export default function OnlineOthello() {
  const {
    board,
    currentPlayer,
    validMoves,
    gameOver,
    winner,
    players,
    myPlayerNumber,
    roomId,
    isMyTurn,
    getMyPlayer,
    getOpponent,
    makeMove,
    resetGame,
    leaveRoom,
  } = useOnlineGameStore();

  const myPlayer = getMyPlayer();
  const opponent = getOpponent();

  // Calculate scores
  const scores = board
    ? board.reduce(
        (acc, row) => {
          row.forEach((cell) => {
            if (cell === 1) acc.purple++;
            if (cell === 2) acc.cyan++;
          });
          return acc;
        },
        { purple: 0, cyan: 0 }
      )
    : { purple: 0, cyan: 0 };

  const handleCellClick = (row, col) => {
    makeMove(row, col);
  };

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Loading game...</p>
        </div>
      </div>
    );
  }

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
          COSMIC OTHELLO
        </motion.h1>

        {/* Room info */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-gray-400 font-mono text-sm">
            Room #{roomId?.slice(-6).toUpperCase()}
          </span>
        </motion.div>

        <motion.div
          className="mb-2 sm:mb-4 flex items-center justify-center gap-4 sm:gap-8 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Player 1 */}
          <motion.div
            className={`flex flex-col items-center p-2 sm:p-3 rounded-lg ${
              currentPlayer === 1 && !gameOver
                ? "bg-slate-800 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "bg-slate-900"
            } transition-all duration-300 w-24 sm:w-32 ${
              myPlayerNumber === 1 ? "ring-2 ring-purple-500" : ""
            }`}
            animate={{
              scale: currentPlayer === 1 && !gameOver ? 1.05 : 1,
              y: currentPlayer === 1 && !gameOver ? -5 : 0,
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 mb-1 sm:mb-2 flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-purple-400 opacity-70"></div>
            </div>
            <span className="text-purple-400 font-semibold text-xs sm:text-sm">
              {players[0]?.name || "PURPLE"}
            </span>
            {myPlayerNumber === 1 && (
              <span className="text-purple-300 text-xs font-mono">(YOU)</span>
            )}
            <motion.div
              className="text-xl sm:text-2xl font-bold text-purple-300 mt-0 sm:mt-1"
              key={scores.purple}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              {scores.purple}
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

          {/* Player 2 */}
          <motion.div
            className={`flex flex-col items-center p-2 sm:p-3 rounded-lg ${
              currentPlayer === 2 && !gameOver
                ? "bg-slate-800 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-slate-900"
            } transition-all duration-300 w-24 sm:w-32 ${
              myPlayerNumber === 2 ? "ring-2 ring-cyan-500" : ""
            }`}
            animate={{
              scale: currentPlayer === 2 && !gameOver ? 1.05 : 1,
              y: currentPlayer === 2 && !gameOver ? -5 : 0,
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-300 mb-1 sm:mb-2 flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-cyan-200 opacity-70"></div>
            </div>
            <span className="text-cyan-400 font-semibold text-xs sm:text-sm">
              {players[1]?.name || "CYAN"}
            </span>
            {myPlayerNumber === 2 && (
              <span className="text-cyan-300 text-xs font-mono">(YOU)</span>
            )}
            <motion.div
              className="text-xl sm:text-2xl font-bold text-cyan-300 mt-0 sm:mt-1"
              key={scores.cyan}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              {scores.cyan}
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
              key={`${currentPlayer}-${isMyTurn()}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`font-mono text-sm ${
                isMyTurn() ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {gameOver
                ? "Game Over"
                : isMyTurn()
                ? "🎯 YOUR TURN"
                : `⏳ ${opponent?.name || "Opponent"}'s turn`}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Main board */}
      <div className="flex-grow flex items-center justify-center w-full">
        <OnlineBoard
          board={board}
          validMoves={validMoves}
          onCellClick={handleCellClick}
          disabled={!isMyTurn() || gameOver}
        />
      </div>

      {/* Footer with buttons */}
      <motion.div
        className="flex gap-4 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {gameOver && (
          <motion.button
            onClick={resetGame}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md font-semibold tracking-wider"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(34, 197, 94, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            PLAY AGAIN
          </motion.button>
        )}

        <motion.button
          onClick={leaveRoom}
          className="px-6 py-2 bg-slate-800 border border-red-700 text-red-400 rounded-md font-semibold tracking-wider hover:bg-red-900/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          LEAVE ROOM
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
                {winner === 0 ? (
                  <p className="text-lg sm:text-xl text-yellow-400 font-semibold">
                    IT'S A TIE!
                  </p>
                ) : (
                  <p className="text-lg sm:text-xl font-semibold">
                    <span
                      className={
                        winner === 1 ? "text-purple-400" : "text-cyan-400"
                      }
                    >
                      {winner === myPlayerNumber
                        ? "YOU WIN!"
                        : `${
                            winner === 1 ? players[0]?.name : players[1]?.name
                          } WINS!`}
                    </span>
                  </p>
                )}
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
                    {players[0]?.name || "PURPLE"}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-300">
                    {scores.purple}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-300 mb-2 mx-auto flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-cyan-200 opacity-70"></div>
                  </div>
                  <p className="text-cyan-400 font-semibold text-sm sm:text-base">
                    {players[1]?.name || "CYAN"}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-cyan-300">
                    {scores.cyan}
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
                  className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md font-semibold tracking-wider"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(34, 197, 94, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  PLAY AGAIN
                </motion.button>

                <motion.button
                  onClick={leaveRoom}
                  className="flex-1 py-2 sm:py-3 bg-slate-800 border border-red-700 text-red-400 rounded-md font-semibold tracking-wider"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  LEAVE
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Online Board Component
function OnlineBoard({ board, validMoves, onCellClick, disabled }) {
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
        className="grid grid-cols-8 gap-[2px] bg-slate-800 p-1 sm:p-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-900 w-full max-w-[min(60vw,60vh)] aspect-square"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <OnlineCell
              key={`${rowIndex}-${cellIndex}`}
              row={rowIndex}
              col={cellIndex}
              value={cell}
              isValidMove={isValidMovePosition(rowIndex, cellIndex)}
              onClick={onCellClick}
              disabled={disabled}
            />
          ))
        )}
      </motion.div>
    </motion.div>
  );
}

// Online Cell Component
function OnlineCell({ row, col, value, isValidMove, onClick, disabled }) {
  const handleClick = () => {
    if (!disabled && isValidMove) {
      onClick(row, col);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`w-full h-full aspect-square flex items-center justify-center bg-slate-900 border border-cyan-900 relative rounded-md overflow-hidden ${
        !disabled && isValidMove ? "cursor-pointer" : "cursor-default"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: (row + col) * 0.02 }}
      whileHover={{
        boxShadow:
          !disabled && isValidMove
            ? "0 0 8px 2px rgba(6, 182, 212, 0.7)"
            : "none",
        scale: !disabled && isValidMove ? 1.05 : 1,
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
        {!disabled && isValidMove && value === 0 && (
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
      {!disabled && isValidMove && (
        <motion.div
          className="absolute inset-0 bg-cyan-500 opacity-10 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Disabled overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-slate-900/50 z-20"></div>
      )}
    </motion.div>
  );
}
