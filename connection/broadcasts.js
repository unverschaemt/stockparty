var m = module.exports = {};
var colors = require('colors');
var config = require('./config.js');

m.broadcasts = {};

m.add = function(name, fn){
    m.broadcasts[name] = fn;
};

m.get = function(name){
    if(m.broadcasts[name]){
        return m.broadcasts[name];
    } else {
        return function(data){
            console.error(('Could not call broadcast ['+name+']').red, data);
        }
    }
};
