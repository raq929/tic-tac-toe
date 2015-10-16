//Game logic

//create a representation of the game board
var board = {
  one: '',
  two: '',
  three: '',
  four: '',
  five:'',
  six:'',
  seven: '',
  eight: '',
  nine: ''
}

//array of CSS class for each square
var squareClasses = [
'one', 'two','three','four', 'five', 'six', 'seven', 'eight', 'nine']

//I think this is no longer necessary, but nice to have if the tallies aren't right
var score = {
  'X': 0,
  'O': 0,
  'tie': 0
};

//Initial conditions
var player = 'X';
var winner = null;


//write a function that maps the board object to an array
var boardToArray = function(board){
  var array = [];
  for(var i =0, length = squareClasses.length; i < length; i++ ){
    gameState[i] = (board[squareClasses[i]]);
  }
};

//write a function that maps an array to the board object

var arrayToBoard = function(array){
  for(var i =0, length = squareClasses.length; i < length; i++ ){
    board[squareClasses[i]] = array[i];
  }
};

//Determine winner
var winsRow = function (player){
   return board.one === player && board.two === player && board.three === player
   || board.four === player && board.five === player && board.six === player
   || board.seven === player && board.eight === player && board.nine === player;
}

var winsColumn = function(player){
  return board.one === player && board.four === player && board.seven === player
  || board.two === player && board.five === player && board.eight === player
  || board.three === player && board.six === player && board.nine === player;
}

var winsDiagonal = function(player){
  return board.one === player && board.five === player && board.nine === player
  || board.three === player && board.five === player && board.seven === player;
}

var winnerIs = function (player) {
  return winsRow(player) || winsColumn(player) || winsDiagonal(player);
}

//Converts score(number) to a tally mark.
var scoreToHTML = function(number){
  //array of the letters that correspond to tally marks 1-5
  var tallies = ['a', 'b', 'c', 'd', 'e'];
  var fives = 0;
  var ones = number % 5;
  var string = '';
  //if there will be a fives tally, create the string for it
  if(number > 4){
    fives = Math.floor(number/5);
    for(i = 0; i < fives; i++){
      string = string + "e <br>";
    }
  }
  //if there will be a ones tally, append that to the string
  if(ones !== 0){
     string = string + tallies[ones-1];
    }
  return string;
}

//checks if there is a winner, calls displayWinner (returns a Boolean)
var checkForWinner = function(player){
  //check for winner or tie
  if(turns > 4 && winnerIs(player) || turns > 8){

    return true;
  } else return false;
}










