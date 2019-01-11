'use strict';
const co =require('co');

module.exports = function(LoginModel) {
  Object.assign(LoginModel, {
    login(params, cb) {
      co(function* handler() {
        try {
          const where = {};
          Object.assign(where, {
            name: params.name,
            password: params.password
          });
          const regData = yield LoginModel.find({where});
          if (Object.keys(params).length) {
            if (Object.keys(regData).length) {
              cb(null, {message: '登录成功',status: 200, })
            }  else {
              cb(null, {message: '用户名或者密码错误', status: 201});
            }
          }
        } catch (e) {
          cb(e);
        }
      });
    },
    modify(originalName, originalPassword, newName, newPassword, cb) {
      co(function* handler() {
        try {
          const where = {};
          Object.assign(where, {
            name: originalName,
            password: originalPassword,
          });
          const originalData = yield LoginModel.find({where});
          if(Object.keys(originalData).length) {
            const where1 = {};
            Object.assign(where1, {
              name: newName,
              password: newPassword,
              id: originalData[0].id,
            });
            const data = yield LoginModel.upsert(where1);
            cb(null, data);
          } else {
            const err = new Error('原始的账号或密码不对');
            err.statusCode = 401;
            cb(err);
          }
          
        } catch (e) {
          cb(e)
        }
      });
    }
  });
  LoginModel.remoteMethod('login', {
    accepts: [
      {
        arg: 'params',
        type: 'object',
        description: '参数',
        http: {source: 'body'},
        required: true,
      },
    ],
    http: {verb: 'post',  path: '/login'},
    returns: {arg: 'auth', type: 'string', root: true},
  });
  LoginModel.remoteMethod('modify', {
    accepts: [
      {
        arg: 'originalName',
        type: 'string',
        description: '原来的账号',
        http: {source: 'query'},
      },
      {
        arg: 'originalPassword',
        type: 'string',
        description: '原来的密码',
        http: {source: 'query'},
      },
      {
        arg: 'newName',
        type: 'string',
        description: '新的账号',
        http: {source: 'query'},
      },
      {
        arg: 'newPassword',
        type: 'string',
        description: '新的密码',
        http: {source: 'query'},
      },
    ],
    http: {verb: 'get', path: '/modify'},
    returns: { arg: 'auth', type: 'string', root: true},
  });
}