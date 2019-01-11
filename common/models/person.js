'use strict';
const co = require('co');
module.exports = function(PersonModel) {
  Object.assign(PersonModel, {
    list(id, cb) {
      const mod = PersonModel.app.models.Person;
      co(function* handler() {
        try {
          const data = yield mod.findById(id);
          cb(null, data);
        } catch (err) {
          cb(err);
        }
      });
    },
    creat(params, cb) {
      co(function* handler() {
        try {
          const list = yield PersonModel.create({
            name: params.name,
            level: params.level,
            age: params.age,
          });
          cb(null, list);
        } catch (e) {
          cb(e);
        }
      });
    },
  });
  PersonModel.disableRemoteMethod('exists', true); // 屏蔽一个接口
  PersonModel.remoteMethod('list', {
    accepts: [
      {
        arg: 'id',
        type: 'number',
        description: 'id',
        http: {source: 'query'},
        required: true,
      },
    ],
    http: {verb: 'get', path: '/list'},
    returns: {arg: 'auth', type: 'string', root: true},
  });
  PersonModel.remoteMethod('creat', {
    accepts: [
      {
        arg: 'params',
        type: 'object',
        description: '等级',
        http: {source: 'body'},
        required: true,
      },
    ],
    http: {verb: 'post', path: '/creatdata'},
    returns: {arg: 'auth', type: 'string', root: true},
  });
};
