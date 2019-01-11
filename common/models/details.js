'use strict';
const co = require('co');
module.exports = function(DetailModel) {
  Object.assign(DetailModel, {
    select(params, cb) {
      co(function* handler() {
        try {
          const where = {};
          for (const key in params) {
            Object.assign(where, {
              [key]: params[key],
            });
          }
          const filter = {where};
          console.log('filter--', filter);
          const data = yield DetailModel.find(filter);
          cb(null, data);
        } catch (e) {
          cb(e);
        }
      });
    },
    list(price, name, cb) {
      co(function* handler() {
        try {
          const where = {};
          Object.assign(where, {
            price,
            name,
          });
          const filter = {where};
          console.log('filter--', filter);
          const data = yield DetailModel.find(filter);
          cb(null, data);
        } catch (e) {
          cb(e);
        }
      });
    },
  });
  DetailModel.remoteMethod('select', {
    accepts: [
      {
        arg: 'params',
        type: 'object',
        http: {source: 'body'},
      },
    ],
    http: {verb: 'post', path: '/select'},
    returns: {arg: 'autn', type: 'string', root: true},
  });
  DetailModel.remoteMethod('list', {
    accepts: [
      {
        arg: 'price',
        type: 'number',
        required: true,
        http: {source: 'query'},
      },
      {
        arg: 'name',
        type: 'string',
        required: true,
        http: {source: 'query'},
      },
    ],
    http: {verb: 'get', path: '/list'},
    returns: {arg: 'autn', type: 'string', root: true},
  });
};
