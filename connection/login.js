
var connection = require('./connection.js');
var m = module.exports = {};

m.acceptLogin = function(socket){
    connection.use(socket);
};

m.loginFail = function(socket, info){
    socket.emit('loginfail', {'info':info});
};

m.use = function(socket){

    socket.on('login', function(data, fn){
        if(data.username === 'hans' && data.password === 'passi'){
            m.acceptLogin(socket);
        } else {
            fn();
            m.loginFail(socket, 'username invalid');
        }
    });

};
