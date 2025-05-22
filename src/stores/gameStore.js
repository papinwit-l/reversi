import { create } from "zustand";

// Initialize an 8x8 board with the starting position
const createInitialBoard = () => {
  const board = Array(8)
    .fill(0)
    .map(() => Array(8).fill(0));
  // Set up the initial four pieces in the center
  board[3][3] = 2; // Cyan
  board[3][4] = 1; // Purple
  board[4][3] = 1; // Purple
  board[4][4] = 2; // Cyan
  return board;
};

// Modify the store initialization to ensure validMoves is always an array
const useGameStore = create((set, get) => ({
  board: createInitialBoard(),
  currentPlayer: 1, // 1 for purple, 2 for cyan
  validMoves: [], // Initialize as empty array
  gameOver: false, // Track if the game is over
  winner: 0, // 0 for tie, 1 for purple, 2 for cyan
  skipTurn: false, // Track if a turn was skipped

  // Calculate all valid moves for the current player
  calculateValidMoves: () => {
    const { board, currentPlayer, isValidMove } = get();
    const moves = [];

    // Check all positions on the board
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(row, col)) {
          moves.push([row, col]);
        }
      }
    }

    // Only update state if the valid moves have actually changed
    const currentValidMoves = get().validMoves || [];
    const movesChanged =
      moves.length !== currentValidMoves.length ||
      moves.some(
        (move, i) =>
          !currentValidMoves[i] ||
          move[0] !== currentValidMoves[i][0] ||
          move[1] !== currentValidMoves[i][1]
      );

    if (movesChanged) {
      set({ validMoves: moves });
    }

    // Check if the current player has no valid moves
    if (moves.length === 0) {
      // Switch to the other player to check if they have moves
      const otherPlayer = currentPlayer === 1 ? 2 : 1;
      const { hasValidMoves, shouldEndGame } =
        get().checkGameStatus(otherPlayer);

      if (shouldEndGame) {
        // Game is over - determine winner
        get().determineWinner();
      } else if (!hasValidMoves) {
        // Both players have no moves - game over
        get().determineWinner();
      } else if (!get().skipTurn) {
        // Current player has no moves but other player does - skip turn
        set({ currentPlayer: otherPlayer, skipTurn: true });
        setTimeout(() => {
          get().calculateValidMoves();
          set({ skipTurn: false });
        }, 1000);
      }
    }

    return moves;
  },

  // Check if a player has valid moves
  checkGameStatus: (player) => {
    const { board, isValidMove } = get();
    let hasValidMoves = false;

    // Check all positions for valid moves
    outerLoop: for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        // Temporarily set current player to check moves
        const originalPlayer = get().currentPlayer;
        set({ currentPlayer: player });

        if (isValidMove(row, col)) {
          hasValidMoves = true;
          // Restore original player
          set({ currentPlayer: originalPlayer });
          break outerLoop;
        }

        // Restore original player
        set({ currentPlayer: originalPlayer });
      }
    }

    // Check if the other player also has no moves
    const otherPlayer = player === 1 ? 2 : 1;
    let otherPlayerHasNoMoves = true;

    if (!hasValidMoves) {
      // Check if other player has moves
      outerLoop: for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          // Temporarily set current player to check moves
          const originalPlayer = get().currentPlayer;
          set({ currentPlayer: otherPlayer });

          if (isValidMove(row, col)) {
            otherPlayerHasNoMoves = false;
            // Restore original player
            set({ currentPlayer: originalPlayer });
            break outerLoop;
          }

          // Restore original player
          set({ currentPlayer: originalPlayer });
        }
      }
    }

    return {
      hasValidMoves,
      shouldEndGame: !hasValidMoves && otherPlayerHasNoMoves,
    };
  },

  // Determine the winner based on piece count
  determineWinner: () => {
    const { board } = get();

    // Count pieces
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

    // Determine winner
    let winner = 0; // Tie
    if (scores.purple > scores.cyan) {
      winner = 1; // Purple wins
    } else if (scores.cyan > scores.purple) {
      winner = 2; // Cyan wins
    }

    // Set game over state
    set({ gameOver: true, winner });
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

    let validMove = false;

    for (const [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      const flippable = [];

      // Check if adjacent cell has opponent's piece
      if (
        x >= 0 &&
        x < 8 &&
        y >= 0 &&
        y < 8 &&
        board[x][y] !== 0 &&
        board[x][y] !== currentPlayer
      ) {
        flippable.push([x, y]);
        x += dx;
        y += dy;

        // Continue in this direction
        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
          if (board[x][y] === 0) break;
          if (board[x][y] === currentPlayer) {
            validMove = true;
            break;
          }
          flippable.push([x, y]);
          x += dx;
          y += dy;
        }
      }
    }

    return validMove;
  },

  // Make a move and flip pieces
  makeMove: (row, col) => {
    const { board, currentPlayer, isValidMove, gameOver } = get();

    // Don't allow moves if game is over
    if (gameOver) return;

    if (!isValidMove(row, col)) return;

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
        newBoard[x][y] === currentPlayer
      ) {
        for (const [fx, fy] of flippable) {
          newBoard[fx][fy] = currentPlayer;
        }
      }
    }

    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    set({ board: newBoard, currentPlayer: nextPlayer });

    // Calculate valid moves for the next player after state update
    setTimeout(() => {
      get().calculateValidMoves();
    }, 0);
  },

  // Reset the game
  resetGame: () => {
    set({
      board: createInitialBoard(),
      currentPlayer: 1,
      validMoves: [],
      gameOver: false,
      winner: 0,
      skipTurn: false,
    });

    // Calculate valid moves after state update
    setTimeout(() => {
      get().calculateValidMoves();
    }, 0);
  },
}));

// Fix the initialization to properly handle the async nature of Zustand
setTimeout(() => {
  // Calculate valid moves after the store is fully initialized
  useGameStore.getState().calculateValidMoves();
}, 0);

export default useGameStore;
