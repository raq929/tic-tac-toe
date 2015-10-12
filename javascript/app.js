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

//array of CSS class for each square
var squareClasses = [
'one', 'two','three','four', 'five', 'six', 'seven', 'eight', 'nine']

//I think this is no longer necessary, but nice to have if the tallies aren't right
var score = {
  'X': 0,
  'O': 0,
  'tie': 0
}

//array of the letters that correspond to tally marks 1-5
var tallies = ['a', 'b', 'c', 'd', 'e']

//Initial conditions
var player = 'X';
var turns = 0;
var winner = null;

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

  var str = $(column).text();
  var lastLetter = str.slice(-1);
  //if the tally count is 1-4, replace the last letter of the string with
  //the next tally mark
  //if the tallies have reached five, add a line break and 1
  if (lastLetter === 'e'){
    str = str + '<br> a';
  //if there is no score, add 1
  } else if (str === ''){
      str = 'a';
  //if the tallies are 1-4, replace and add the tally + 1
  } else {
    for (var i = 0, length = tallies.length - 1; i < length; i++){
      if(lastLetter === tallies[i]){
        str = str.replace(lastLetter, tallies[i+1]);
      }
    }
  }
  //Replace text in the html doc
  $(column).html(str);
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
  for(i = 0; i < squareClasses.length; i++){
    $('.'+ squareClasses[i]).text('');
    board[squareClasses[i]] = null;
  winner = null;
  }
}

//checks if there is a winner, calls displayWinner (returns a Boolean)
var checkForWinner = function(player){
  //check for winner or tie
  if(turns > 4 && winnerIs(player) || turns === 9){
    displayWinner(player);
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
//Draw an x or o in the squares
//Add an x or o in the appropriate place in the board object
//Indicate whose turn is next.
var placeX = function(event){
  //determine whose turn it is
  if (turns%2 === 0){
    player = 'X';
  } else {
    player = 'O';
  }
  //add the appropriate x or o to the board object
  if(!$(this).text()){
    $(this).append(player);
    //increment the turns
    turns += 1;
    addToBoard(event);
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


