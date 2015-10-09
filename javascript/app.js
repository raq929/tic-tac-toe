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


//Determine game over


//Determine winner


//Indicate game score
