'use strict';
const co = require('co');

module.exports = function(LawModel) {
  Object.assign(LawModel, {
    list(id, cb) {
      const mod = LawModel.app.models.Law;
      co(function* handler() {
        try {
          const data = yield LawModel.findById(id);
          cb(null, data);
        } catch (err) {
          cb(err);
        }
      });
    },
    select(params, cb) {
      co(function* handler() {
        try {
          const where = {};
          for (const key in params) {
            Object.assign(where, {
              [key]: params[key],
            });
          }
          const filter = {
            where,
            include: [
              {
                relation: 'details',
              },
            ],
          };
          const data = yield LawModel.find(filter);
          const kong = {
            data: [],
            msg: '',
            count: 0,
            statusCode: 200,
          };
          const res = {
            data,
            msg: 'success',
            statusCode: 200,
            count: data.length,
          };
          const response = data.length === 0 ? kong : res;
          cb(null, response);
        } catch (e) {
          cb(e);
        }
      });
    },
  });
  LawModel.remoteMethod('list', {
    accepts: [
      {
        arg: 'id',
        type: 'number',
        require: true,
        http: {source: 'query'},
      },
    ],
    http: {verb: 'get', path: '/list'},
    returns: {arg: 'auth', type: 'string', root: true},
  });
  LawModel.remoteMethod('select', {
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
};
