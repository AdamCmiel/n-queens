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
window.findNRooksSolution = function(n){
  var solution = new Board(makeEmptyMatrix(n)); 
  var recursiveStep = function(rowIndex, colIndex){
    if (rowIndex === n){
      return;
    }
    solution.togglePiece(rowIndex, colIndex);
    if (solution.hasAnyRooksConflicts()){
      solution.togglePiece(rowIndex, colIndex);
      if (colIndex+1 < n ){
        recursiveStep(rowIndex, colIndex+1);
      }
      if (colIndex+1 === n){
        recursiveStep(rowIndex+1, 0);
      }
    }
  };
  recursiveStep(0,0);
  return solution.rows();
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n){
  if (n === 0) return 1;
  var solutionCount = 0; 

  var solution = new Board(makeEmptyMatrix(n));
  var recursiveStep = function(row){
    for (var col = 0; col<n; col++){
      solution.togglePiece(row, col);
      var board = solution.rows();
      if (!solution.hasAnyRooksConflicts()){
        if (row+1<n){
          recursiveStep(row+1);
        } else {
          solutionCount++;
        }
      }
      solution.togglePiece(row, col);
    }
  };
  var before = new Date();
  recursiveStep(0);
  var duration = new Date()-before;
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  console.log(n+" Rooks: "+solutionCount+" solutions, took "+duration+" ms("+(duration/1000)+" seconds)");
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n){
  if (n === 0) return 1;
  var solutionCount = 0; 

  var solution = new Board(makeEmptyMatrix(n));
  var recursiveStep = function(row){
    for (var col = 0; col<n; col++){
      solution.togglePiece(row, col);
      var board = solution.rows();
      if (!solution.hasAnyQueensConflicts()){
        if (row+1<n){
          recursiveStep(row+1);
        } else {
          solutionCount++;
        }
      }
      solution.togglePiece(row, col);
    }
  };
  recursiveStep(0);
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution.rows();
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n){
  if (n === 0) return 1;
  var solutionCount = 0; 

  var solution = new Board(makeEmptyMatrix(n));
  var recursiveStep = function(row){
    for (var col = 0; col<n; col++){
      solution.togglePiece(row, col);
      var board = solution.rows();
      if (!solution.hasAnyQueensConflicts()){
        if (row+1<n){
          recursiveStep(row+1);
        } else {
          debugger;
          solutionCount++;
        }
      }
      solution.togglePiece(row, col);
    }
  };
  recursiveStep(0);
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
