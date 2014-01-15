// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function(){

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (typeof params == "undefined" || params == null) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function(){
      return _(_.range(this.get('n'))).map(function(rowIndex){
        return this.get(rowIndex);
      }, this);
    },

    getColumn: function(colIndex){
      return _.map(this.rows(), function(row, rowIndex){
        return row[colIndex];
      }, this);
    },

    columns: function(){
      return _(_.range(this.get('n'))).map(function(colIndex){
        return this.getColumn(colIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex){
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex){
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex){
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function(){
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex){
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function(){
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex){
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
    hasRowConflictAt: function(rowIndex){
      var rowSum = _.reduce(this.get(rowIndex), function(memo, space){
        return memo+space;
      }, 0, this);
      return rowSum > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function(){
      return _.reduce(this.rows(), function(memo, row, rowIndex){
        return memo || this.hasRowConflictAt(rowIndex);
      }, false, this);
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    // 
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex){
      var colSum = _.reduce(this.getColumn(colIndex), function(memo, space){
        return memo+space;
      }, 0, this);
      return colSum > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function(){
      return _.reduce(this.columns(), function(memo, col, colIndex){
        return memo || this.hasColConflictAt(colIndex);
      }, false, this);
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    // 
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow){
      var board = this.rows(); 
      var y = majorDiagonalColumnIndexAtFirstRow;
      var x = 0;
      var n = this.get('n');
      while (y < 0){
        y++;
        x++;
      };
      var sum = 0;
      while (x < n && y < n){
        sum += board[x][y];
        y++; 
        x++;
      }
      return sum > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function(){
      var n = this.get('n');
      return _(_.range(-n, n)).reduce(function(memo, diagonal){
        return memo || this.hasMajorDiagonalConflictAt(diagonal);
      }, false, this);
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    // 
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow){
      var board = this.rows();
      var y = minorDiagonalColumnIndexAtFirstRow;
      var x = 0;
      var n = this.get('n');
      while(y > n){
        y--;
        x++;
      };
      var sum = 0;
      while(x < n && y >= 0){
        sum += board[x][y];
        y--;
        x++;
      }
      return sum > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function(){
      var n = this.get('n');
      return _(_.range(0, 2*n)).reduce(function(memo, diagonal){
        return memo || this.hasMinorDiagonalConflictAt(diagonal);
      }, false, this);
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n){
    return _(_.range(n)).map(function(){
      return _(_.range(n)).map(function(){
        return 0;
      });
    });
  };

  window.makeEmptyMatrix = makeEmptyMatrix;

}());
