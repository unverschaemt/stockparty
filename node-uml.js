var fs = require('fs');
//var m = module.exports = {};
var m = {};
console.log('START ==========================================================================================');

m.followRequire = function (beginFile, depth, mods, limit) {
    var limit = limit || 20;
    var depth = depth || 0;
    var mods = mods || {};
    if (!mods[beginFile]) {
        console.log('HAVE TO CREATE');
        mods[beginFile] = {
            '_dir': beginFile,
            'depth': depth,
            'scanned': false
        };
    }
    if (mods[beginFile] && mods[beginFile].scanned === false && !mods[beginFile].dependencies && depth < 100) {
        mods[beginFile].scanned = true;
        var dirarray = beginFile.split('/');
        var dirwithoutfile = [];
        depth++;

        if (dirarray.length === 1) {
            console.error('Invalid path');
        }

        for (var i = 0; i < dirarray.length - 1; i++) {
            dirwithoutfile.push(dirarray[i]);
        }
        console.log('Reading', beginFile);
        var filedata = fs.readFileSync(beginFile, {
            'encoding': 'utf8'
        });
        //filedata = filedata.replace(/\s/g, '');
        var filearray = filedata.split('require(');
        var modules = [];
        var mydir = './';
        for (var i = 1; i < filearray.length; i++) {
            var newfile = filearray[i].split(')')[0];
            while (newfile[0] === ' ' || newfile[0] === '/n' || newfile[0] === '/s') {
                newfile = newfile.substr(1);
            }
            while (newfile[newfile.length - 1] === ' ' || newfile[0] === '/n' || newfile[0] === '/s') {
                newfile = newfile.substr(0, newfile.length - 1);
            }
            if ((newfile[0] === '"' && newfile[newfile.length - 1] === '"') || (newfile[0] === "'" && newfile[newfile.length - 1] === "'")) {
                newfile = newfile.substr(1, newfile.length - 2);
                var dir = newfile.split('/');
                if (dir.length > 1) {
                    var out = JSON.parse(JSON.stringify(dirwithoutfile));
                    if (dir[0] === '.') {
                        dir.shift();
                    }
                    console.log('dir, out', dir, out);
                    while (dir[0] === '..') {
                        dir.shift();
                        out.pop();
                    }
                    console.log('dir, out', dir, out);
                    for (var k = 0; k < dir.length; k++) {
                        out.push(dir[k]);
                    }
                    console.log('dir, out', dir, out);
                    var newdir = out.join('/');
                    if(newdir.substr(newdir.length-3) !== '.js'){
                        newdir += '.js';
                    }
                    modules.push(newdir);
                    if (!mods[newdir]) {
                        mods[newdir] = {
                            '_dir': newdir,
                            'depth': depth,
                            'scanned': false,
                            'dependents': 1
                        };
                    } else {
                        mods[newdir].dependents++;
                    }
                    if (!mods[beginFile].dependencies) {
                        mods[beginFile].dependencies = [];
                    }
                    mods[beginFile].dependencies.push(newdir);
                }
            } else {
                console.log('error => cannot parse requiere');
            }
        }

        console.log(modules);
        console.log(mods);
        for (var i in modules) {
            console.log('Loead', modules[i], 'from', beginFile);
            mods = m.followRequire(modules[i], depth, mods, limit);
        }
    }
    return mods;
};

m.getUnknownModuleData = function(dir){
    var mod = require(dir);
    switch(typeof mod){
        case 'function':
            var obj = new mod();
            break;
        case 'object':
            var obj = mod;
            var out = [];
            for(var i in obj){
                out.push('');
            }
            break;
        default:

            break;
    }

};

console.log('ENDE: ', m.followRequire('./app.js'));
