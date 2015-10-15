'use strict';

var gameState = [];
var currentToken;
var currentGame;
var playerID = null;
var player_x = null;
var player_o = null;

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

  var loadGame = function(array){
    arrayToBoard(array);
    for(var i =0, length = squareClasses.length; i < length; i++ ){
      $('.' + squareClasses[i]).text(board[squareClasses[i]]);
      if(board[squareClasses[i]]){
        turns+=1;
      }
    }
  };

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
      console.log(data.user.token)
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
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4));
    //set the gameState array to the data from the server
    gameState = data.game.cells;
    //sets permisisons to play x or o
    console.log('playerID ' + playerID);
    console.log('data.game.player_x ' + data.game.player_x.id)
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
    //hide the message div
    $('.message').hide();
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

    //populate the board
    loadGame(gameState);
    });
  });

  $('#mark-cell').on('submit', function(e) {
    var token = currentToken;
    var id = currentGame;
    var data = wrap('game', wrap('cell', form2object(this)));
    e.preventDefault();
    tttapi.markCell(id, data, token, function callback(error, data) {
      if (error) {
        console.log(error);
        $('#result').val('status: ' + error.status + ', error: ' +error.error);
        return;
      }
    });
  });
  //listen for other player's turn
  $('table').on('click', function(e){
      e.preventDefault();

      var gameWatcher = tttapi.watchGame(currentGame, currentToken);

      gameWatcher.on('change', function(data){
        var parsedData = JSON.parse(data);
        if (data.timeout) { //not an error
          this.gameWatcher.close();
          return console.warn(data.timeout);
        }

        var gameData = parsedData.game;
        var cell = gameData.cell;
        var index = cell.index;
        var value = cell.value;
        gameState[index] = value;
        loadGame(gameState);

        $('#watch-index').val(cell.index);
        $('#watch-value').val(cell.value);
      });
      gameWatcher.on('error', function(e){
        console.error('an error has occured with the stream', e);
      });
    });
  });

