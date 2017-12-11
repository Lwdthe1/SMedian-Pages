angularApp
	.factory('SocketIO', function (socketFactory) {
        var socket = socketFactory();
        socket.forward('page_admin');
        socket.forward('user_send_access_token')
        return socket;
    })
