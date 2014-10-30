var colors = require('colors');
var readline = require('readline');

var m = module.exports = {};

var toLength = function (str, len) {
    var s = '' + str + '';
    while (s.length < len) {
        s += ' ';
    }
    return s;
};

m.use = function (socket, data) {
    m.socket = socket;
    m.owndata = data;
    if(m.socket.chosenclient){
        m.socket.clientchoice(m.socket.chosenclient);
    } else {
        m.showchoice();
    }
    // TODO: Show ClientList with data
};

m.showchoice = function () {
    console.log('> Please choose a client'.green);
    console.log('>    KEY | ID         | Type                 | Name                 | Connections ');
    for (var i in m.owndata.data) {
        console.log('>    ' + toLength(i, 3) + ' | ' + toLength(m.owndata.data[i]._id, 10) + ' | ' + toLength(m.owndata.data[i].type, 20) + ' | ' + toLength(m.owndata.data[i].name, 20) + ' | ' + m.owndata.data[i].connections);
    }

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('> Please enter the client KEY of your choice '.yellow, function (answer) {
        var i = parseInt(answer);
        if (m.owndata.data.length > i) {
            console.log(('Loading Client ' + m.owndata.data[i]._id + '...').green);
            m.socket.clientchoice(m.owndata.data[i]._id);
            m.socket.chosenclient = m.owndata.data[i]._id;
        } else {
            console.log(('Invalid Key! => '+i).red);
            setTimeout(m.showchoice, 0);
            //m.socket.destroy();
        }
        rl.close();
    });
};
