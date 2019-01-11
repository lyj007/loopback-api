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
};
