"use client";

import useGameStore from "@/stores/gameStore";
import { motion } from "framer-motion";
import Cell from "./Cell";

function Board() {
  const board = useGameStore((state) => state.board);
  const validMoves = useGameStore((state) => state.validMoves || []);

  const isValidMovePosition = (row, col) => {
    return validMoves && validMoves.some(([r, c]) => r === row && c === col);
  };

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* <motion.h2
        className="text-xl font-bold text-cyan-400 tracking-wider"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        QUANTUM REVERSI
      </motion.h2> */}

      <motion.div
        className="grid grid-cols-8 gap-1 bg-slate-800 p-3 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-900"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <Cell
              key={`${rowIndex}-${cellIndex}`}
              row={rowIndex}
              col={cellIndex}
              value={cell}
              isValidMove={isValidMovePosition(rowIndex, cellIndex)}
            />
          ))
        )}
      </motion.div>
    </motion.div>
  );
}

export default Board;
