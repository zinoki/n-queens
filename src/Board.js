// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var matrixArr = this.rows();
      var sum = 0;
      for (var i = 0; i < matrixArr[rowIndex].length; i++) {
        sum += matrixArr[rowIndex][i];
      }
      if (sum > 1) {
        return true;
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var matrixArr = this.rows(); // store matrix as row of rows
      for (var i = 0; i < matrixArr.length; i++) {
        if (this.hasRowConflictAt(i, matrixArr)) {
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var matrixArr = this.rows();
      var sum = 0;
      
      for (var i = 0; i < matrixArr.length; i++) {
        var row = matrixArr[i];
        if (row[colIndex] === 1) {
          sum++;
        }
      }
      
      if (sum > 1) {
        return true;
      }
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var matrixArr = this.rows(); // store matrix as row of rows
      
      for (var i = 0; i < matrixArr.length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(colNumber, rowNumber) {
      // given an index, checks following rows for instances of 1 by targeting 
      // index + 1 for every following row 
      var matrixArr = this.rows();
      while (colNumber > 0 && rowNumber > 0) {
        if (matrixArr[rowNumber - 1][colNumber - 1] === 1) {
          return true;
        }
        colNumber--;
        rowNumber--;
      }
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    // loop through matrix looking for any instances of 1 and save that location 
    // and later call hasMajorDiagonalConflictAt using those inputs
    
    hasAnyMajorDiagonalConflicts: function() {
      var matrixArr = this.rows();

      for (var i = 0; i < matrixArr.length; i++) {
        var row = matrixArr[i];
        for (var j = 0; j < row.length; j++) {
          if (row[j] === 1) {
            if (this.hasMajorDiagonalConflictAt(j, i)) {
              return true;
            }
          }
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(colNumber, rowNumber) {
      var matrixArr = this.rows();
      colNumber = colNumber + 1;
      rowNumber = rowNumber - 1;
      
      
      for (var i = rowNumber; i >= 0; i--) {
        if (matrixArr[i][colNumber] === 1) {
          return true;
        }
        colNumber++;
      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var matrixArr = this.rows();

      for (var i = 0; i < matrixArr.length; i++) {
        var row = matrixArr[i];
        for (var j = 0; j < row.length; j++) {
          if (row[j] === 1) {
            if (this.hasMinorDiagonalConflictAt(j, i)) {
              return true;
            }
          }
        }
      }
      return false; // fixme
    },
    hasNoQueenConflicts: function(colNum, rowNum) {
      if (!(this.hasMinorDiagonalConflictAt(colNum, rowNum) || 
          this.hasMajorDiagonalConflictAt(colNum, rowNum) || 
          this.hasColConflictAt(colNum) || 
          this.hasRowConflictAt(rowNum))) {
        return true;
      } else {
        return false;
      }
    },

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
