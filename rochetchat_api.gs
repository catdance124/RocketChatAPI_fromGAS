var username = PropertiesService.getScriptProperties().getProperty('USERNAME');
var password = PropertiesService.getScriptProperties().getProperty('PASSWORD');
var chat = PropertiesService.getScriptProperties().getProperty('CHAT_URL');

// ロケットチャットにログイン
function login_rocketchat() {
  var URL = chat+"/api/v1/login";
  var postData = {
    "username" : username,
    "password" : password
  };
  var options = {
    "method" : "POST",
    "headers" : {
      "Content-Type" : "application/json"
    },
    "payload" : JSON.stringify(postData)
  };
  var response = UrlFetchApp.fetch(URL, options);
  var content = JSON.parse(response.getContentText());
  
  var authToken = content['data']['authToken'];
  var userId = content['data']['userId'];
  
  return [authToken, userId];
}

// チャンネルIDを取得
function get_channel_id(channel){
  var [authToken, userId] = login_rocketchat();
  var URL = chat + "/api/v1/channels.info?roomName=" + channel;
  var options = {
    "method" : "GET",
    "headers" : {
      "X-Auth-Token" : authToken,
      "X-User-Id" : userId
    }
  };
  var response = UrlFetchApp.fetch(URL, options);
  var content = JSON.parse(response.getContentText());
  
  return content['channel']['_id'];
}

// 指定チャンネルにメッセージを送信
function post_message(channel, text) {
  var [authToken, userId] = login_rocketchat();
  var URL = chat + "/api/v1/chat.postMessage";
  var postData = {
    "roomId" : get_channel_id(channel),
    "text" : text
  };
  var options = {
    "method" : "POST",
    "headers" : {
      "X-Auth-Token" : authToken,
      "X-User-Id" : userId,
      "Content-Type" : "application/json"
    },
    "payload" : JSON.stringify(postData)
  };
  
  UrlFetchApp.fetch(URL, options);
}

// 指定チャンネルにファイルを送信
function post_file(channel, file) {
  var [authToken, userId] = login_rocketchat();
  var URL = chat + "/api/v1/rooms.upload/" + get_channel_id(channel);
  var boundary = "boundary"
  var requestBody = Utilities.newBlob(
    "--" + boundary + "\r\n"
    + "Content-Disposition: form-data; name=\"file\"; filename=\"" + file.getName() + "\"\r\n"
    + "Content-Type: " + file.getContentType() + "\r\n\r\n").getBytes()
    .concat(file.getBytes())
    .concat(Utilities.newBlob("\r\n--"+boundary+"--\r\n").getBytes());
  var options = {
    contentType : "multipart/form-data; boundary=" + boundary,
    "method" : "POST",
    "headers" : {
      "X-Auth-Token" : authToken,
      "X-User-Id" : userId
    },
    "payload" : requestBody
  };
  
  UrlFetchApp.fetch(URL, options);
}

function get_channel_history(channel){
  var [authToken, userId] = login_rocketchat();
  var URL = chat + "/api/v1/channels.history?roomId=" + get_channel_id(channel);
  URL = URL + '&count=30';
  var options = {
    "method" : "GET",
    "headers" : {
      "X-Auth-Token" : authToken,
      "X-User-Id" : userId
    }
  };
  var response = UrlFetchApp.fetch(URL, options);
  var content = JSON.parse(response.getContentText());
  
  return content['messages']
}

function delete_message(channel, message_id){
  var [authToken, userId] = login_rocketchat();
  var URL = chat + "/api/v1/chat.delete";
  var postData = {
    "roomId" : get_channel_id(channel),
    "msgId" : message_id
  };
  var options = {
    "method" : "POST",
    "headers" : {
      "X-Auth-Token" : authToken,
      "X-User-Id" : userId,
      "Content-Type" : "application/json"
    },
    "payload" : JSON.stringify(postData)
  };
  
  UrlFetchApp.fetch(URL, options);
}

function delete_latest_message(channel){
  messages = get_channel_history(channel);
  messages.some(function(message) {
    if (message['u']['username'] == username){
      Logger.log(message['_id']);
      delete_message(channel, message['_id'])
      return true;
    }
  });
}

function main(){
  var channel = "api-test-channel";
  delete_latest_message(channel);
}
