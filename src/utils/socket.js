/**
 * h5 socket
 */

export function socket(passUrl) {
  var socket
  var url = passUrl ? passUrl : 'ws://10.0.3.106:8888/ws/cabinetTerminal/backMacKey'
      
  if (!!window.WebSocket && window.WebSocket.prototype.send) {
    /*supported*/
    socket = new WebSocket(url)
    socket.onopen = function()
    {
      // Web Socket 已连接上，使用 send() 方法发送数据
      console.log("已连接...", new Date())
    };
    
    socket.onmessage = function (evt) 
    { 
      // var received_msg = evt.data;
      console.log("数据已接收...")
      console.log("evt", evt)
    };
    
    socket.onclose = function()
    { 
      // 关闭 websocket
      console.log("连接已关闭...", new Date())
    };

    socket.onerror = function(e)
    { 
      // 关闭 websocket
      console.log(e,'出错')
    };
    return socket
  } else {
  }
}

export function init(passUrl, websocket) {
  if (!passUrl) {
    console.log('websocket url not exist')
  }
  if (!websocket) {
    return socket(passUrl)
  } else {
    websocket.close()
    return socket(passUrl)
  }
}

