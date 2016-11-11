var App = function() {
  var app = {};
};

App.prototype.init = function() {

};

App.prototype.send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.fetch = function(url) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: url,
    type: 'GET',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.clearMessages = function() {
  var messages = document.getElementById('chats');
  while (messages.firstChild) {
    messages.firstChild.remove();
  }
};

App.prototype.renderMessage = function(message) {
  var text = $('#chats').html('<blink>' + message.text + '</blink>');
  var messages = document.getElementById('chats');
  messages.append(text);

};

App.prototype.renderRoom = function() {

};

var app = new App();