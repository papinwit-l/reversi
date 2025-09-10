// src/stores/aiGameStore.js

import { create } from "zustand";
import OthelloAI from "@/ai/OthelloAI";

// Initialize an 8x8 board with the starting position
const createInitialBoard = () => {
  const board = Array(8)
    .fill(0)
    .map(() => Array(8).fill(0));
  // Set up the initial four pieces in the center
  board[3][3] = 2; // Cyan (AI)
  board[3][4] = 1; // Purple (Human)
  board[4][3] = 1; // Purple (Human)
  board[4][4] = 2; // Cyan (AI)
  return board;
};

const useAIGameStore = create((set, get) => ({
  // Game state
  board: createInitialBoard(),
  currentPlayer: 1, // 1 for human (purple), 2 for AI (cyan)
  validMoves: [],
  gameOver: false,
  winner: 0,

  // AI settings
  aiDifficulty: "medium", // 'easy', 'medium', 'hard'
  aiPlayer: 2, // AI is always player 2 (cyan)
  humanPlayer: 1, // Human is always player 1 (purple)
  aiThinking: false,
  aiThinkingTime: 1000, // Base thinking time in ms

  // AI instance
  ai: new OthelloAI("medium"),

  // Track timeouts to clear them properly
  currentTimeout: null,

  // Set AI difficulty
  setAIDifficulty: (difficulty) => {
    set({
      aiDifficulty: difficulty,
      ai: new OthelloAI(difficulty),
    });
  },

  // Clear any pending AI timeouts
  clearAITimeout: () => {
    const { currentTimeout } = get();
    if (currentTimeout) {
      clearTimeout(currentTimeout);
      set({ currentTimeout: null });
    }
  },

  // Calculate all valid moves for the current player
  calculateValidMoves: () => {
    const { board, currentPlayer, isValidMove, gameOver } = get();

    // Don't calculate moves if game is over
    if (gameOver) {
      return [];
    }

    const moves = [];

    // Check all positions on the board
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(row, col)) {
          moves.push([row, col]);
        }
      }
    }

    set({ validMoves: moves });

    // Check if current player has no valid moves
    if (moves.length === 0) {
      get().handleNoValidMoves();
    } else if (
      get().currentPlayer === get().aiPlayer &&
      !get().gameOver &&
      !get().aiThinking
    ) {
      // AI's turn - make move after a delay
      get().makeAIMove();
    }

    return moves;
  },

  // Handle case when player has no valid moves
  handleNoValidMoves: () => {
    const { currentPlayer, aiPlayer, humanPlayer, gameOver } = get();

    if (gameOver) return; // Don't process if game is already over

    const otherPlayer = currentPlayer === aiPlayer ? humanPlayer : aiPlayer;

    // Switch to other player
    set({ currentPlayer: otherPlayer });

    // Calculate moves for other player
    const timeoutId = setTimeout(() => {
      if (get().gameOver) return; // Check again before processing

      const { calculateValidMoves } = get();
      const otherPlayerMoves = calculateValidMoves();

      if (otherPlayerMoves.length === 0) {
        // Both players have no moves - game over
        get().determineWinner();
      }
    }, 500);

    set({ currentTimeout: timeoutId });
  },

  // Make AI move
  makeAIMove: async () => {
    const { board, validMoves, ai, aiDifficulty, gameOver, aiThinking } = get();

    if (gameOver || aiThinking || validMoves.length === 0) return;

    set({ aiThinking: true });

    // Calculate thinking time based on difficulty
    const thinkingTime =
      aiDifficulty === "easy" ? 500 : aiDifficulty === "medium" ? 1000 : 1500;

    // Add some randomness to thinking time to make it feel more natural
    const actualThinkingTime = thinkingTime + Math.random() * 500;

    const timeoutId = setTimeout(() => {
      // Double-check game state before making move
      const currentState = get();
      if (
        currentState.gameOver ||
        currentState.currentPlayer !== currentState.aiPlayer
      ) {
        set({ aiThinking: false, currentTimeout: null });
        return;
      }

      const bestMove = ai.getBestMove(
        currentState.board,
        currentState.aiPlayer,
        currentState.validMoves
      );

      if (bestMove) {
        const [row, col] = bestMove;
        get().makeMove(row, col);
      }

      set({ aiThinking: false, currentTimeout: null });
    }, actualThinkingTime);

    set({ currentTimeout: timeoutId });
  },

  // Check if a move is valid
  isValidMove: (row, col) => {
    const { board, currentPlayer } = get();

    // Can't place on an occupied cell
    if (board[row][col] !== 0) return false;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let foundOpponent = false;

      // Check if we can flip pieces in this direction
      while (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] !== 0) {
        if (board[x][y] !== currentPlayer) {
          foundOpponent = true;
        } else if (foundOpponent) {
          return true;
        } else {
          break;
        }
        x += dx;
        y += dy;
      }
    }

    return false;
  },

  // Make a move and flip pieces
  makeMove: (row, col) => {
    const {
      board,
      currentPlayer,
      isValidMove,
      gameOver,
      humanPlayer,
      aiPlayer,
      aiThinking,
    } = get();

    // Don't allow moves if game is over
    if (gameOver) return false;

    // Don't allow human moves during AI thinking (unless it's the AI making the move)
    if (aiThinking && currentPlayer === humanPlayer) return false;

    if (!isValidMove(row, col)) return false;

    // Clear any pending timeouts
    get().clearAITimeout();

    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[row][col] = currentPlayer;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    // Flip pieces in all valid directions
    for (const [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      const flippable = [];

      // Find opponent's pieces
      while (
        x >= 0 &&
        x < 8 &&
        y >= 0 &&
        y < 8 &&
        newBoard[x][y] !== 0 &&
        newBoard[x][y] !== currentPlayer
      ) {
        flippable.push([x, y]);
        x += dx;
        y += dy;
      }

      // If we found our own piece at the end, flip all pieces in between
      if (
        x >= 0 &&
        x < 8 &&
        y >= 0 &&
        y < 8 &&
        newBoard[x][y] === currentPlayer &&
        flippable.length > 0
      ) {
        for (const [fx, fy] of flippable) {
          newBoard[fx][fy] = currentPlayer;
        }
      }
    }

    const nextPlayer = currentPlayer === humanPlayer ? aiPlayer : humanPlayer;
    set({
      board: newBoard,
      currentPlayer: nextPlayer,
      aiThinking: false, // Ensure AI thinking is cleared
    });

    // Calculate valid moves for next player
    setTimeout(() => {
      if (!get().gameOver) {
        get().calculateValidMoves();
      }
    }, 100);

    return true;
  },

  // Determine the winner based on piece count
  determineWinner: () => {
    const { board } = get();

    // Clear any pending timeouts
    get().clearAITimeout();

    // Count pieces
    const scores = board.reduce(
      (acc, row) => {
        row.forEach((cell) => {
          if (cell === 1) acc.human++;
          if (cell === 2) acc.ai++;
        });
        return acc;
      },
      { human: 0, ai: 0 }
    );

    // Determine winner
    let winner = 0; // Tie
    if (scores.human > scores.ai) {
      winner = 1; // Human wins
    } else if (scores.ai > scores.human) {
      winner = 2; // AI wins
    }

    // Set game over state
    set({
      gameOver: true,
      winner,
      aiThinking: false, // Ensure AI thinking is cleared
    });
  },

  // Reset the game
  resetGame: () => {
    console.log("Reset game called");

    // Clear any pending timeouts first
    get().clearAITimeout();

    // Reset all state
    set({
      board: createInitialBoard(),
      currentPlayer: 1, // Human starts
      validMoves: [],
      gameOver: false,
      winner: 0,
      aiThinking: false,
      currentTimeout: null,
    });

    // Calculate valid moves for the starting player
    setTimeout(() => {
      if (!get().gameOver) {
        get().calculateValidMoves();
      }
    }, 100);
  },

  // Get current scores
  getScores: () => {
    const { board } = get();
    return board.reduce(
      (acc, row) => {
        row.forEach((cell) => {
          if (cell === 1) acc.human++;
          if (cell === 2) acc.ai++;
        });
        return acc;
      },
      { human: 0, ai: 0 }
    );
  },

  // Check if it's human's turn
  isHumanTurn: () => {
    const { currentPlayer, humanPlayer, gameOver } = get();
    return !gameOver && currentPlayer === humanPlayer;
  },

  // Get difficulty display name
  getDifficultyName: (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "Easy";
      case "medium":
        return "Medium";
      case "hard":
        return "Hard";
      default:
        return "Medium";
    }
  },
}));

export default useAIGameStore;
