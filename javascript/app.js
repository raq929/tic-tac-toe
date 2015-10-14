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

var gameState = []

//array of CSS class for each square
var squareClasses = [
'one', 'two','three','four', 'five', 'six', 'seven', 'eight', 'nine']

//I think this is no longer necessary, but nice to have if the tallies aren't right
var score = {
  'X': 0,
  'O': 0,
  'tie': 0
};

//array of the letters that correspond to tally marks 1-5
var tallies = ['a', 'b', 'c', 'd', 'e'];

//Initial conditions
var player;
var turns = 0;
var winner = null;
var gamesCompleted = 0;


//write a function that maps the board object to an array
var boardToArray = function(board){
  var array = [];
  for(var i =0, length = squareClasses.length; i < length; i++ ){
    gameState.push(board[squareClasses[i]]);
  }
}

//write a function that maps an array to the board object

var arrayToBoard = function(array){
  for(var i =0, length = squareClasses.length; i < length; i++ ){
    board[squareClasses[i]] = array[i];
  }
}


var loadGame = function(array){
  arrayToBoard(array);
  for(var i =0, length = squareClasses.length; i < length; i++ ){
    $('.' + squareClasses[i]).text(board[squareClasses[i]]);
    if(board[squareClasses[i]]){
      turns+=1;
    }
  }
}

//write a clickhandler that updates a game


//Set player names
var setPlayerNames = function(){
  //get input from input fields
  var playerA = $('#inputA').val();
  var playerB = $('#inputB').val();
  //Add input to the player divs
  $('.playerA').prepend(playerA);
  $('.playerB').prepend(playerB);
}

//hide message div
var hideMessage = function() {
  $(".message").hide('slow');
  clearBoard();
}

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
 scoreToHTML = function(number){
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

//display the score as tally marks on the screen
var displayScore = function(winner){
  //score is only incremented for the winning player
  //if the tallies have reached 5, add a new line
  var column

  switch(winner){
    case 'X':
    column = '.scoreX .tally'
    break;

    case 'O':
    column = '.scoreO .tally';
    break;

    case 'tie':
    column = '.scoreTie .tally';
    break;
    }

  $(column).html(scoreToHTML(score[winner]));
}

//determines who the winner is and calls up the message div to display it
var displayWinner = function (player){
  //determines winner if there is one or shows a tie
  if(winnerIs(player)){
    winner = player;
    $('.message').html(winner + ' wins! <br> <button type="button">Play Again!</button>')
  } else {
    winner = 'tie'
    $('.message').html('It\'s a tie <br> <button type="button">Play Again!</button>');
  }
  //increments scoreboard
  score[winner] += 1;
  displayScore(winner);
  //display winner & play again message
  $('.message').show('slow');
  $('button').on('click', hideMessage);
}

//resets initial conditions
var clearBoard = function (){
  turns = 0;
  winner = null;
  for(i = 0; i < squareClasses.length; i++){
    $('.'+ squareClasses[i]).text('');
    board[squareClasses[i]] = '';
  }
  if (gamesCompleted%2 === 1){
    $('.turn .letter').text("O");
  }
}

//checks if there is a winner, calls displayWinner (returns a Boolean)
var checkForWinner = function(player){
  //check for winner or tie
  if(turns > 4 && winnerIs(player) || turns === 9){
    displayWinner(player);
    gamesCompleted += 1;
    //start over, clear board
    return true;
  } else return false;
}

//add the x or o to the board object
var addToBoard = function(event){
  var box =  event.target;
  for(i = 0; i < squareClasses.length; i++)
    if($(box).hasClass(squareClasses[i])){
      board[squareClasses[i]] = player;
  }
}

var switchTurns = function(){
  //determine whose turn it is
  //if an even number of games have been completed, X goes first
  if (gamesCompleted%2 === 0) {
    //if an even number of turns have been taken, it is X's turn
    //if not, it is O's turn
    if (turns%2 === 0){
      player = 'X';
    } else {
      player = 'O';
    }
  } else {
    //for odd numbered games, O goes first.
    if (turns%2 === 0){
      player = 'O';
    } else {
      player = 'X';
    }
  }
}

//Draw an x or o in the squares
//Add an x or o in the appropriate place in the board object
//Indicate whose turn is next.
var placeX = function(event){
  switchTurns();

  //add the appropriate x or o to the table div
  if(!$(this).text()){
    $(this).append(player);
    //increment the turns
    turns += 1;
    //after successful click, add player marker to the board object
    addToBoard(event);
    //if there is no winner, change the turn indicator
    // if there is a winner, running checkForWinner will trigger the message div
    if(!checkForWinner(player)){
    //set the turn indicator
      if(player === 'X'){
        $('.turn .letter').text("O");
      } else {
        $('.turn .letter').text("X");
      }
    } else {
      $('.turn .letter').text("X");
    }
  }
}

//set click handlers
var playTicTacToe = function(){
  //click handlers on initial message div
  $('button').on('click', setPlayerNames);
  $('button').on('click', hideMessage);
  //Recognize a click in the square, add it to the board
  $('.square').on('click', placeX);
}

playTicTacToe();


