// src/components/othello/Cell.jsx

import useGameStore from "@/stores/gameStore";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Cell({ row, col, value, isValidMove }) {
  const makeMove = useGameStore((state) => state.makeMove);

  const handleClick = () => {
    makeMove(row, col);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="w-full h-full aspect-square flex items-center justify-center bg-slate-900 border border-cyan-900 relative rounded-md overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: (row + col) * 0.02 }}
      whileHover={{
        boxShadow: isValidMove ? "0 0 8px 2px rgba(6, 182, 212, 0.7)" : "none",
        scale: isValidMove ? 1.05 : 1,
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
        {isValidMove && value === 0 && (
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
      {isValidMove && (
        <motion.div
          className="absolute inset-0 bg-cyan-500 opacity-10 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
}
