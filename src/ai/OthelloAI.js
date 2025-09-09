// src/ai/OthelloAI.js

class OthelloAI {
  constructor(difficulty = "medium") {
    this.difficulty = difficulty;
    this.maxDepth = this.getMaxDepth(difficulty);

    // Position weights for strategic play
    this.positionWeights = [
      [100, -20, 10, 5, 5, 10, -20, 100],
      [-20, -50, -2, -2, -2, -2, -50, -20],
      [10, -2, -1, -1, -1, -1, -2, 10],
      [5, -2, -1, -1, -1, -1, -2, 5],
      [5, -2, -1, -1, -1, -1, -2, 5],
      [10, -2, -1, -1, -1, -1, -2, 10],
      [-20, -50, -2, -2, -2, -2, -50, -20],
      [100, -20, 10, 5, 5, 10, -20, 100],
    ];
  }

  getMaxDepth(difficulty) {
    switch (difficulty) {
      case "easy":
        return 2;
      case "medium":
        return 4;
      case "hard":
        return 6;
      default:
        return 4;
    }
  }

  // Main function to get AI move
  getBestMove(board, currentPlayer, validMoves) {
    if (validMoves.length === 0) return null;

    switch (this.difficulty) {
      case "easy":
        return this.getEasyMove(board, currentPlayer, validMoves);
      case "medium":
        return this.getMediumMove(board, currentPlayer, validMoves);
      case "hard":
        return this.getHardMove(board, currentPlayer, validMoves);
      default:
        return this.getMediumMove(board, currentPlayer, validMoves);
    }
  }

  // Easy AI: Random moves with slight preference for corners
  getEasyMove(board, currentPlayer, validMoves) {
    // 30% chance to make a strategic move, 70% random
    if (Math.random() < 0.3) {
      const corners = validMoves.filter(
        ([row, col]) => (row === 0 || row === 7) && (col === 0 || col === 7)
      );
      if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
    }

    // Random move
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  // Medium AI: Minimax with limited depth and basic evaluation
  getMediumMove(board, currentPlayer, validMoves) {
    let bestMove = null;
    let bestScore = -Infinity;

    for (const [row, col] of validMoves) {
      const newBoard = this.makeMove(board, row, col, currentPlayer);
      const score = this.minimax(
        newBoard,
        this.maxDepth - 1,
        false,
        currentPlayer,
        -Infinity,
        Infinity
      );

      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }

    return bestMove || validMoves[0];
  }

  // Hard AI: Advanced minimax with better evaluation
  getHardMove(board, currentPlayer, validMoves) {
    let bestMove = null;
    let bestScore = -Infinity;

    for (const [row, col] of validMoves) {
      const newBoard = this.makeMove(board, row, col, currentPlayer);
      const score = this.minimaxAdvanced(
        newBoard,
        this.maxDepth - 1,
        false,
        currentPlayer,
        -Infinity,
        Infinity
      );

      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }

    return bestMove || validMoves[0];
  }

  // Basic minimax algorithm
  minimax(board, depth, isMaximizing, aiPlayer, alpha, beta) {
    if (depth === 0) {
      return this.evaluateBoard(board, aiPlayer);
    }

    const currentPlayer = isMaximizing ? aiPlayer : aiPlayer === 1 ? 2 : 1;
    const validMoves = this.getValidMoves(board, currentPlayer);

    if (validMoves.length === 0) {
      return this.evaluateBoard(board, aiPlayer);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const [row, col] of validMoves) {
        const newBoard = this.makeMove(board, row, col, currentPlayer);
        const eval_ = this.minimax(
          newBoard,
          depth - 1,
          false,
          aiPlayer,
          alpha,
          beta
        );
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const [row, col] of validMoves) {
        const newBoard = this.makeMove(board, row, col, currentPlayer);
        const eval_ = this.minimax(
          newBoard,
          depth - 1,
          true,
          aiPlayer,
          alpha,
          beta
        );
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return minEval;
    }
  }

  // Advanced minimax with better evaluation
  minimaxAdvanced(board, depth, isMaximizing, aiPlayer, alpha, beta) {
    if (depth === 0) {
      return this.evaluateBoardAdvanced(board, aiPlayer);
    }

    const currentPlayer = isMaximizing ? aiPlayer : aiPlayer === 1 ? 2 : 1;
    const validMoves = this.getValidMoves(board, currentPlayer);

    if (validMoves.length === 0) {
      return this.evaluateBoardAdvanced(board, aiPlayer);
    }

    // Sort moves by potential (corners first, then edges, then others)
    validMoves.sort((a, b) => this.getMoveScore(b) - this.getMoveScore(a));

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const [row, col] of validMoves) {
        const newBoard = this.makeMove(board, row, col, currentPlayer);
        const eval_ = this.minimaxAdvanced(
          newBoard,
          depth - 1,
          false,
          aiPlayer,
          alpha,
          beta
        );
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const [row, col] of validMoves) {
        const newBoard = this.makeMove(board, row, col, currentPlayer);
        const eval_ = this.minimaxAdvanced(
          newBoard,
          depth - 1,
          true,
          aiPlayer,
          alpha,
          beta
        );
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  // Basic board evaluation
  evaluateBoard(board, aiPlayer) {
    let score = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === aiPlayer) {
          score += this.positionWeights[row][col];
        } else if (board[row][col] !== 0) {
          score -= this.positionWeights[row][col];
        }
      }
    }

    return score;
  }

  // Advanced board evaluation
  evaluateBoardAdvanced(board, aiPlayer) {
    const opponent = aiPlayer === 1 ? 2 : 1;
    let score = 0;

    // Position-based scoring
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === aiPlayer) {
          score += this.positionWeights[row][col];
        } else if (board[row][col] === opponent) {
          score -= this.positionWeights[row][col];
        }
      }
    }

    // Mobility (number of valid moves)
    const aiMoves = this.getValidMoves(board, aiPlayer).length;
    const opponentMoves = this.getValidMoves(board, opponent).length;
    score += (aiMoves - opponentMoves) * 10;

    // Stability (pieces that cannot be flipped)
    score += this.getStability(board, aiPlayer) * 5;
    score -= this.getStability(board, opponent) * 5;

    // Corner control
    score += this.getCornerControl(board, aiPlayer) * 25;
    score -= this.getCornerControl(board, opponent) * 25;

    return score;
  }

  // Calculate stability (simplified version)
  getStability(board, player) {
    let stability = 0;

    // Corners are always stable
    const corners = [
      [0, 0],
      [0, 7],
      [7, 0],
      [7, 7],
    ];
    for (const [row, col] of corners) {
      if (board[row][col] === player) {
        stability += 4;
      }
    }

    // Edges are more stable
    for (let i = 0; i < 8; i++) {
      if (board[0][i] === player) stability += 1;
      if (board[7][i] === player) stability += 1;
      if (board[i][0] === player) stability += 1;
      if (board[i][7] === player) stability += 1;
    }

    return stability;
  }

  // Calculate corner control
  getCornerControl(board, player) {
    let corners = 0;
    const cornerPositions = [
      [0, 0],
      [0, 7],
      [7, 0],
      [7, 7],
    ];

    for (const [row, col] of cornerPositions) {
      if (board[row][col] === player) {
        corners++;
      }
    }

    return corners;
  }

  // Get score for move ordering
  getMoveScore([row, col]) {
    // Corners are best
    if ((row === 0 || row === 7) && (col === 0 || col === 7)) {
      return 100;
    }
    // Edges are good
    if (row === 0 || row === 7 || col === 0 || col === 7) {
      return 50;
    }
    // Center is okay
    return 10;
  }

  // Helper function to make a move and return new board
  makeMove(board, row, col, player) {
    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = player;

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
        newBoard[x][y] !== player
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
        newBoard[x][y] === player &&
        flippable.length > 0
      ) {
        for (const [fx, fy] of flippable) {
          newBoard[fx][fy] = player;
        }
      }
    }

    return newBoard;
  }

  // Helper function to get valid moves
  getValidMoves(board, player) {
    const moves = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.isValidMove(board, row, col, player)) {
          moves.push([row, col]);
        }
      }
    }

    return moves;
  }

  // Helper function to check if move is valid
  isValidMove(board, row, col, player) {
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

      while (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] !== 0) {
        if (board[x][y] !== player) {
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
  }
}

export default OthelloAI;
