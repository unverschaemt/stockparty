var utils = require('../utils.js');

var m = module.exports = {};

m.device = function (_id, type, name, hid) {
    this._id = _id;
    this.type = type;
    this.name = name;
    this.hid = hid;
};

m.client = function (_id, type, name) {
    this._id = _id;
    this.name = name;
    this.type = type;
    switch (type) {
    case 'adminpanel':
        this.maxsockets = 9999999;
        this.view = 'adminpanel';
        break;
    case 'cashpanel':
        this.maxsockets = 1;
        this.idd = '';
        this.cashscreen = '';
        this.view = 'cashpanel';
        break;
    case 'cashscreen':
        this.maxsockets = 1;
        this.view = 'cashscreen';
        break;
    case 'monitor':
        this.maxsockets = 1;
        this.view = 'monitor';
        break;
    case 'connector':
        this.maxsockets = 9999999;
        this.view = 'adminpanel';
        break;
    }
};

m.data = {
    'global': {
        'configmode': false,
        'devicenameprefix': 'device',
        'clientnameprefix': 'client'
    },
    'clients': {
        'client00': {
            '_id': 'client00',
            'name': 'ADMIN',
            'type': 'adminpanel',
            'maxsockets': 99999,
            'view': 'adminpanel'
        },
        'client01': {
            '_id': 'client01',
            'name': 'Kasse 1',
            'type': 'cashpanel',
            'maxsockets': 1,
            'idd': 'device01',
            'view': 'cashpanel'
        },
        'client02': {
            '_id': 'client02',
            'name': 'Kasse 2',
            'type': 'cashpanel',
            'maxsockets': 1,
            'idd': 'device02',
            'view': 'cashpanel'
        }
    },
    'devices': {
        'device01': {
            '_id': 'device01',
            'type': 'idd',
            'name': 'RFID Device1',
            'hid': 'USB_02xd82jf'
        },
        'device02': {
            '_id': 'device02',
            'type': 'idd',
            'name': 'RFID Device2',
            'hid': 'USB_02xd82jh'
        }
    }
}
m.runtime = {
    'client00': {
        'sockets': [] //Socket

    },
    'client01': {
        'sockets': [] //Socket

    },
    'client02': {
        'sockets': [] //Socket

    },
    'device01': {
        'client': 'client01'
    },
    'device02': {
        'client': 'client02'
    }
}
