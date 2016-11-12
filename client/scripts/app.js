var App = function() {
  var server = 'https://api.parse.com/1/classes/messages';
  window.friendsObj = {};
};
/*
  ========================================
  Init
  ========================================
*/
App.prototype.init = function() {
  console.log('INITIALIZE STUFF');
  var parseServer = 'https://api.parse.com/1/classes/messages';
  this.fetch(parseServer);
  this.fetchRooms(parseServer);
};

/*
  ========================================
  POST Request
  ========================================
*/
App.prototype.send = function(message, roomIndex) {
  var that = this;
  console.log(message);
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent', data);
      that.fetchByRoom('https://api.parse.com/1/classes/messages', roomIndex);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

/*
  ========================================
  GET Requests
  ========================================
*/
App.prototype.fetch = function(url) {
  var that = this;
  $.ajax({
    url: url,
    type: 'GET',
    data: 'order=-createdAt',
    dataType: 'json',
    success: function (data) {
      console.log('chatterbox: Message retrieved');
      that.refresh(data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
};

App.prototype.fetchRooms = function(url) {
  var that = this;
  $.ajax({
    url: url,
    type: 'GET',
    data: 'order=-createdAt',
    dataType: 'json',
    success: function (data) {
      console.log('chatterbox: Message retrieved');
      that.initRooms(data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
};

App.prototype.fetchByRoom = function(url, roomIndex) {
  var that = this;
  var selectedRoom = document.getElementById('roomSelect').options[roomIndex].value;
  console.log(selectedRoom);
  $.ajax({
    url: url,
    type: 'GET',
    data: 'where={"roomname":' + JSON.stringify(selectedRoom) + '}',
    dataType: 'json',
    success: function (data) {
      console.log('chatterbox: Message retrieved');
      that.refresh(data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
};

App.prototype.fetchByUsername = function(url, username) {
  console.log(username);
  var that = this;
  $.ajax({
    url: url,
    type: 'GET',
    data: 'where={"username":' + JSON.stringify(username) + '}',
    dataType: 'json',
    success: function (data) {
      console.log('chatterbox: Message retrieved');
      that.refresh(data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
};

/*
  ========================================
  Chat Room Dropdown Selector
  ========================================
*/
App.prototype.initRooms = function(data) {
  var roomList = [];
  var uniqRooms = [];

  for (var i = 0; i < data.results.length; i++) {
    roomList.push(data.results[i].roomname);
  }
  uniqRooms = _.uniq(roomList);
  for (var j = 0; j < uniqRooms.length; j++) {
    this.renderRoom(uniqRooms[j]);
  }
};

App.prototype.renderRoom = function(roomName) {
  var rooms = document.getElementById('roomSelect');
  var newRoom = document.createElement('option');
  newRoom.innerHTML = roomName;
  rooms.appendChild(newRoom);
};

App.prototype.clearRoom = function(roomName) {
  var rooms = document.getElementById('roomSelect');
  while (rooms.firstChild) {
    rooms.firstChild.remove();
  }
};

/*
  ========================================
  Chat Box Messages
  ========================================
*/
App.prototype.renderMessage = function(data) {
  var chat = document.getElementById('chats');
  var messageBox = document.createElement('div');
  messageBox.className = 'messageBox';

  var msgUsername = document.createElement('div');
  msgUsername.className = 'msgUsername';
  msgUsername.onclick = this.addToFriendList;
  msgUsername.innerHTML = data.username;

  var msgText = document.createElement('div');
  msgText.className = 'msgText';
  msgText.innerHTML = data.text;

  messageBox.appendChild(msgUsername);
  messageBox.appendChild(msgText);
  chat.appendChild(messageBox);

};

App.prototype.clearMessages = function() {
  var messages = document.getElementById('chats');
  while (messages.firstChild) {
    messages.firstChild.remove();
  }
};

App.prototype.refresh = function(data) {
  this.clearMessages();
  for (var i = 0; i < data.results.length; i++) {
    this.renderMessage(data.results[i]);
  }
};

/*
  ========================================
  Friends List
  ========================================
*/
App.prototype.addToFriendList = function() {
  console.log(window.friendsObj);
  //var friend = document.createElement('li');
  //friend.innerHTML = this.innerHTML;
  //friend.className = 'friends';
  //$('.friendList').append(friend);
  //friend.onclick = app.fetchByUsername('https://api.parse.com/1/classes/messages', this.innerHTML);
  if (!window.friendsObj[this.innerHTML]) {
    window.friendsObj[this.innerHTML] = this.innerHTML;
    $('.friendList').append('<li class="friends"><a href="#">' + this.innerHTML + '</a></li>');
    $('a[href="#"]').click(function() {
      app.fetchByUsername('https://api.parse.com/1/classes/messages', this.innerHTML);
    });
  }
  //$('.friendList').append('<li onclick="app.fetchByUsername(' + 'https://api.parse.com/1/classes/messages,' + this.innerHTML + ')">' + this.innerHTML + '</li>');
};
/*
  ========================================
  jQuery and Click Handlers
  ========================================
*/
var app = new App();

$(document).ready(function() {
  app.init();

  // console.log('Username is', window.location.search.split('=')[1] );
  var userMsg = {};
  userMsg.username = decodeURI(window.location.search.split('=')[1]);

  document.getElementById('currentUser').innerHTML = 'Current User: ' + userMsg.username;

  $('.submit').click(function() {
    var roomIndex = document.getElementById('roomSelect').selectedIndex;
    userMsg.text = document.getElementById('userMsg').value;
    userMsg.roomname = document.getElementById('roomSelect').value;
    app.send(userMsg, roomIndex);
  });

  $('.addRoom').click(function() {
    var roomIndex = document.getElementById('roomSelect').selectedIndex;
    userMsg.roomname = document.getElementById('newChatRoom').value;
    userMsg.text = 'Welcome to my new room!';
    app.send(userMsg, roomIndex);
  });

  // window.setInterval(function() {
  //   app.fetch('https://api.parse.com/1/classes/messages');
  // }, 3000);

});




























