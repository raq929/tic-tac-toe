//Game logic

//create a representation of the game board
var board = {
  one: null,
  two: null,
  three: null,
  four: null,
  five:null,
  six:null,
  seven: null,
  eight: null,
  nine: null
}

var squareClasses = [
'one', 'two','three','four', 'five', 'six', 'seven', 'eight', 'nine']

var score = {
  'X': 0,
  'O': 0,
  'tie': 0
}
//Know whose turn it is

var player = 'X';

//determine how many turns have been played
var turns = 0;

var winner = null;



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


var displayWinner = function (player){
  //determines winner if there is one
  if(winnerIs(player)){
    winner = player;
    alert(winner + ' wins!');
  } else {
    winner = 'tie'
    alert("It's a tie!");
  }
  //increments scoreboard
  score[winner] += 1;
  winner = null;
  //display score & play again message
}
var checkForWinner = function(player){
  //check for winner or tie
  if(turns > 4 && turns < 10 && winnerIs(player) || turns === 9){
    displayWinner(player);
    //start over, clear board
    turns = 0;
    for(i = 0; i < squareClasses.length; i++){
      $('.'+ squareClasses[i]).text('');
      board[squareClasses[i]] = null;
    }
  }
}

//add the x or o to the board object
var addToBoard = function(event){
  var box =  event.target;
  for(i = 0; i < squareClasses.length; i++)
    if($(box).hasClass(squareClasses[i])){
      board[squareClasses[i]] = player;
  }
}
//Draw an x or o in the squares
var placeX = function(event){
  //determine whose turn it is
  if (turns%2 === 0){
    player = 'X';
  } else {
    player = 'O';
  }
  //add the appropriate x or o to the board
  if(!$(this).text()){
    $(this).append(player);
    //increment the turns
    turns += 1;
    addToBoard(event);
  }
  // see if there's a winner
  checkForWinner(player);
}

var playTicTacToe = function(){
  //Recognize a click in the square
  alert("let's play!");
  $('.square').on('click', placeX);
  $('.square').on('click', addToBoard);
}

playTicTacToe();






//Indicate game score
