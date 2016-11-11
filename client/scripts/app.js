var App = function() {
  var roomList = [];
  var uniqRooms = [];
};

App.prototype.init = function() {
  console.log('INITIALIZE STUFF');
  var parseServer = 'https://api.parse.com/1/classes/messages';
  chatterboxData = this.fetch(parseServer);
  //console.log(chatterboxData);
  //this.renderMessage(chatterboxData.results[0].text);
};

App.prototype.send = function(message) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.fetch = function(url) {
  var that = this;
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      console.log('chatterbox: Message retrieved');
      console.log(data);
      var roomList = [];
      var uniqRooms = [];

      for (var i = 0; i < data.results.length; i++) {
        roomList.push(data.results[i].roomname);
        that.renderMessage(data.results[i]);
      }

      uniqRooms = _.uniq(roomList);
      for (var j = 0; j < uniqRooms.length; j++) {
        that.renderRoom(uniqRooms[j]);
      }
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
};

App.prototype.clearMessages = function() {
  var messages = document.getElementById('chats');
  while (messages.firstChild) {
    messages.firstChild.remove();
  }
};

App.prototype.renderMessage = function(data) {
  var chat = document.getElementById('chats');
  var messageBox = document.createElement('div');
  messageBox.className = 'messageBox';

  var msgUsername = document.createElement('div');
  msgUsername.className = 'msgUsername';
  msgUsername.innerHTML = data.username;

  var msgText = document.createElement('div');
  msgText.className = 'msgText';
  msgText.innerHTML = data.text;

  messageBox.appendChild(msgUsername);
  messageBox.appendChild(msgText);

  chat.appendChild(messageBox);

};

App.prototype.renderRoom = function(roomName) {
  var rooms = document.getElementById('roomSelect');
  var newRoom = document.createElement('option');

  newRoom.innerHTML = roomName;

  rooms.appendChild(newRoom);
};

var app = new App();

$(document).ready(function() {
  app.init();
});


// var message = {
//   username: 'name',
//   text: 'this is a string',
//   roomname: 'random'
// };




























