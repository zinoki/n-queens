/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var solution = [];
  
  for (var i = 0; i < n; i++) {
    var row = new Array(n).fill(0);
    row[i] = 1;
    solution.push(row);
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(numRooks) {
  // var solutionCount = [];
  // var currentIndex = 0;
  var count = 0;
  
  var helper = function(spotsRemaining) {
    if (spotsRemaining > 1) {
      for (var i = 0; i < spotsRemaining; i++) {
        helper(spotsRemaining - 1);
      }
    } else {
      count++;
    }
  };
  helper(numRooks);

  // 

  console.log('Number of solutions for ' + numRooks + ' rooks:', count);
  return count;
  // return solutionCount.length;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(numQueens) {
  // var solution = [];
  var board = new Board({n: numQueens});
  var matrix = board.rows();
  var actual = 0;
  var row = 0;
  console.log('round:', numQueens);
  
  if (numQueens === 0) {
    console.log('Single solution for ' + numQueens + ' queens:', JSON.stringify(matrix));
    return matrix;
  }
  if (numQueens === 1) {
    matrix[0][0] = 1;
    console.log('Single solution for ' + numQueens + ' queens:', JSON.stringify(matrix));
    return matrix;
  }
  if (numQueens === 2 || numQueens === 3) {
    console.log('Single solution for ' + numQueens + ' queens:', JSON.stringify(board));
    return matrix;
  }
  var helper = function(colStart) {
    if (row === 0) {
      col = colStart;
    } else {
      col = 0;
    }
    if (row < numQueens) {
      for (var col = col; col < numQueens; col++) {
        console.log(row, col);
        board.togglePiece(row, col);
        actual++;
        console.log(JSON.stringify(board.rows()));
        // no conflict, right amount of queens
        if (!board.hasAnyQueensConflicts() && actual === numQueens) {
          var matrix = board.rows();
          return matrix;
        }
        // no conflict not enough queens
        if (!board.hasAnyQueensConflicts() && actual !== numQueens) {
          row = row + 1;
          helper(colStart);
          // board.togglePiece(row, col);
          actual--;
        }
        // conflict
        if (board.hasAnyQueensConflicts()) {
          // board.togglePiece(row, col);
          actual--;
        }
        
        // start over
        if (col === numQueens-1 && actual < numQueens) {
          row = 0;
          console.log(JSON.stringify(board.rows()));
          // board.togglePiece(0, 0);
          // board.togglePiece(1, 2);
          
          // var board = new Board({n: numQueens});
          // var matrix = board.rows();
          helper(colStart + 1);

          actual--;
        }
        board.togglePiece(row, colStart);
        
      }
    }
  };
  var result = helper(0);
  console.log('result: ', result);
  return result;

  // console.log('Single solution for ' + numQueens + ' queens:', JSON.stringify(board.rows()));
  
  // return board.rows();
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
