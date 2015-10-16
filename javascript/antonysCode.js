'use strict';

var gameState = [];
var currentToken;
var currentGame;
var playerID = null;
var player_x = null;
var player_o = null;
var turns = 0;

var tttapi = {
  gameWatcher: null,
  ttt: 'http://ttt.wdibos.com',

  ajax: function(config, cb) {
    $.ajax(config).done(function(data, textStatus, jqxhr) {
      cb(null, data);
    }).fail(function(jqxhr, status, error) {
      cb({jqxher: jqxhr, status: status, error: error});
    });
  },

  register: function register(credentials, callback) {
    this.ajax({
      method: 'POST',
      // url: 'http://httpbin.org/post',
      url: this.ttt + '/users',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  login: function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      // url: 'http://httpbin.org/post',
      url: this.ttt + '/login',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  //Authenticated api actions
  listGames: function (token, callback) {
    this.ajax({
      method: 'GET',
      url: this.ttt + '/games',
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },

  createGame: function (token, callback) {
    this.ajax({
      method: 'POST',
      url: this.ttt + '/games',
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({}),
      dataType: 'json',
    }, callback);
  },

  showGame: function (id, token, callback) {
    this.ajax({
      method: 'GET',
      url: this.ttt + '/games/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },

  joinGame: function (id, token, callback) {
    this.ajax({
      method: 'PATCH',
      url: this.ttt + '/games/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({}),
      dataType: 'json'
    }, callback);
  },

  markCell: function (id, data, token, callback) {
    this.ajax({
      method: 'PATCH',
      url: this.ttt + '/games/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      dataType: 'json'
    }, callback);
  },

  watchGame: function (id, token) {
    console.log(id + '' + token);
    var url = this.ttt + '/games/' + id + '/watch';
    var auth = {
      Authorization: 'Token token=' + token
    };
    this.gameWatcher = resourceWatcher(url, auth); //jshint ignore: line
    return this.gameWatcher;
  }
};


//$(document).ready(...
$(function() {
  var form2object = function(form) {
    var data = {};
    $(form).children().each(function(index, element) {
      var type = $(this).attr('type');
      if ($(this).attr('name') && type !== 'submit' && type !== 'hidden') {
        data[$(this).attr('name')] = $(this).val();
      }
    });
    return data;
  };
  var wrap = function wrap(root, formData) {
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
  };

  var callback = function callback(error, data) {
    if (error) {
      console.log(error);
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4));
  };

     //determine whose turn it is
  var switchTurns = function(){
    if (turns%2 === 0){
      player = 'X';
    } else {
      player = 'O';
    }
    //set the turn indicator
    if(turns%2 === 0){
      $('.turn .letter').text("X");
    } else {
      $('.turn .letter').text("O");
    }
    console.log('switchTurns complete. Turns: ' + turns + 'player' +player);
  }

  var loadGame = function(array){
    arrayToBoard(array);
    turns = 0;
    player = 'X';
    for(var i =0, length = squareClasses.length; i < length; i++ ){
      $('.' + squareClasses[i]).text(board[squareClasses[i]]);
      if(board[squareClasses[i]]){
        turns = turns + 1;
      }
    }
    switchTurns(player);
  };

  //display the score as tally marks on the screen
  var displayScore = function(winner){
    //score is only incremented for the winning player
    //if the tallies have reached 5, add a new line
    var column
    if((winner === 'X' && player_x) || (winner === 'O' && player_o)){
      column = '.scoreMe .tally';
    } else if (winner ==='tie') {
      column = '.scoreTie .tally';
    } else {
      column = '.scoreThem .tally';
    }

    $(column).html(scoreToHTML(score[winner]));
  }

  //determines who the winner is, sends game over to server, and calls up the message div to display it
  var displayWinner = function (player){
    //determines winner if there is one or shows a tie
    if(winnerIs(player)){
      winner = player;
      $('#winner').html(winner + ' wins!')
    } else {
      winner = 'tie'
      $('#winner').html('It\'s a tie.');
    }
    //increments scoreboard
    score[winner] += 1;
    displayScore(winner);
    token = currentToken;
    id = currentGame;

    var data = {
      "game": {
        "over": true
      }
    };

    tttapi.markCell(id, data, token, function callback(error, data) {
      if (error) {
        console.log(error);
        $('#result').val('status: ' + error.status + ', error: ' +error.error);
        return;
      }
    });
    //display winner & play again message
    $('.message').show('slow');
  };

  //add the x or o to the board object
  var addToBoard = function(event){
    var box =  event.target;
    for(var i = 0; i < squareClasses.length; i++)
      if($(box).hasClass(squareClasses[i])){
        board[squareClasses[i]] = player;
    }
  }
  //Draw an x or o in the squares
  //Add an x or o in the appropriate place in the board object
  //Indicate whose turn is next.
  var placeX = function(event){

    //add the appropriate x or o to the table div
    if(!$(this).text() &&
      ((player==='X' && player_x)
      || (player==='O'&& player_o)
      )){
      $(this).append(player);
      //after successful click, add player marker to the board object
      addToBoard(event);
      updateServer();
    }
  };

  var updateServer = function() {
    var lastBoard = gameState.slice();
    boardToArray(board);
    var currentBoard = gameState;

    var changedCellIndex = currentBoard.findIndex(function(element, index, array){
      return element != lastBoard[index];
      });

    var data = wrap('game', wrap('cell', {'index': changedCellIndex, 'value': player}));

    var token = currentToken;
    var id = currentGame;
    tttapi.markCell(id, data, token, function callback(error, data) {
      if (error) {
        console.log(error);
        $('#result').val('status: ' + error.status + ', error: ' +error.error);
        error.preventDefault();
        return;
      }
      console.log('markCell complete');
    });
  }

  $('#login').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    var cb = function cb(error, data) {
      if (error) {
        callback(error);
        return;
      }
      callback(null, data);
      $('#login, #register').hide();
      $('.token').val(data.user.token);
      console.log('' + data.user.token)
      currentToken = data.user.token;
      playerID = data.user.id;
    };
    e.preventDefault();
    tttapi.login(credentials, cb);
  });

  $('#list-games').on('submit', function(e) {
    var token = $(this).children('[name="token"]').val();
    e.preventDefault();
    tttapi.listGames(token, callback);
  });

  $('#register').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    tttapi.register(credentials, callback);
    e.preventDefault();
  });

  $('#create-game').on('submit', function(e) {
    var token = $(this).children('[name="token"]').val();
    e.preventDefault();
    tttapi.createGame(currentToken, function(error, data){
      if (error) {
      console.log(error);
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
      }
      currentGame = data.game.id;
      player_x = data.game.player_x.id;
      $('#result').val('Game number: ' + currentGame + '.  You are X. Please put your game number in the Show Game field and click the button to begin your game.');
    });
  });

  $('#show-game').on('submit', function(e) {
    var token = $(this).children('[name="token"]').val();
    var id = $('#show-id').val();
    e.preventDefault();
    tttapi.showGame(id, token, function(error, data){
      if (error) {
      console.log(error);
      $('#result').val("You have not joined this game.");
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4));
    //set the gameState array to the data from the server
    gameState = data.game.cells;
    //sets permisisons to play x or o
    if(playerID === data.game.player_x.id){
      player_x = playerID;
      player_o = null;
    } else {
      player_o = playerID;
      player_x = null;
    }
     //store the game ID
    currentGame = data.game.id;
    //populate the board
    loadGame(gameState);
    switchTurns(player);
    //hide the message div
    $('.message').hide();

    var token = currentToken;
    var gameWatcher = tttapi.watchGame(currentGame, token);

    gameWatcher.on('change', function(data){
      var parsedData = JSON.parse(data);
      if (data.timeout) { //not an error
        this.gameWatcher.close();
        return console.warn(data.timeout);
      }

      //if the last person to play won, display the win message.
      if(checkForWinner(player)){
        displayWinner(player);
        return;
      }
      var gameData = parsedData.game;
      var cell = gameData.cell;
      var index = cell.index;
      var value = cell.value;
      var lastPlayer
      //add the current move to gameState
      gameState[index] = value;
      //load the gameState
      loadGame(gameState);

      switchTurns(player);

    });
    gameWatcher.on('error', function(e){
      console.error('an error has occured with the stream', e);
    });
    });
  });

  $('#join-game').on('submit', function(e, currentToken) {
    var token = $(this).children('[name="token"]').val();
    var currentGame = $('#join-id').val();
    e.preventDefault();
    tttapi.joinGame(currentGame, token, function(error, data){
      if (error) {
      console.log(error);
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
    }
    $('#result').val('You have joined game' + data.game.id +'. You are O. To play this game, enter the game number and click Show Game');
    });
  });

  $('.square').on('click', placeX);
});

