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

//Know whose turn it is

var player = 'X';

//determine how many turns have been played
var turns = 0;

//Draw an x or o in the squares
var placeX = function(event){
  if (turns%2 === 0){
    player = 'X';
  } else {
    player = 'O';
  }
  $(this).append(player);
  turns += 1;
}


//Recognize a click in the square
$('.square').on('click', placeX);

// $('.square').on('click', function(event){
//   alert("You clicked!")
// });



//Determine game over


//Determine winner


//Indicate game score
