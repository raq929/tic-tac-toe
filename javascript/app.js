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
//Know whose turn it is

var player = 'X';

//determine how many turns have been played
var turns = 0;

var winner;
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
}

//Recognize a click in the square
$('.square').on('click', placeX);


//Determine winner
var winsRow = function (player){
   return board.one === player && board.two === player && board.three === player || board.four === player && board.five === player && board.six === player || board.seven === player && board.eight === player && board.nine === player;
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

var winnerIs{
  return winsRow(player) || winsColumn(player) || winsDiagonal(player);
  winner = player;
}

alert(player + ' wins!')




//Indicate game score
