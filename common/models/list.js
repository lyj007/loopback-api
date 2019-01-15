'use strict';
const co = require('co');

module.exports = function(ListModel) {
  Object.assign(ListModel, {
    list(id, cb) {
      co(function* handler() {
        try {
          const mod = ListModel.app.models.Login;
          const data = yield mod.findById(id);
          console.log('data---', data);
          cb(null, data);
        } catch (e) {
          cb(e);
        }
      });
    },
    mymodel(id, options) {
      console.log('---', options);
    },
  });
  ListModel.remoteMethod('list', {
    accepts: [
      {
        arg: 'id',
        type: 'number',
        http: {source: 'query'},
      },
    ],
    http: {verb: 'get', path: '/list'},
    returns: {arg: 'auth', type: 'string', root: true},
  });
  ListModel.remoteMethod('mymodel', {
    accepts: [
      {
        arg: 'id',
        type: 'number',
        http: {source: 'query'},
      },
      {
        arg: 'options',
        type: 'object',
        http: 'optionsFromRequest',  // 在loopback3.0以上才能用 options = { accessToken: xxxx} 可以在json中设置injectOptionsFromRemoteContext: true
      },
    ],
    http: {verb: 'get', path: '/mymodel'},
    returns: {arg: 'auth', type: 'string', root: true},
  });
};
