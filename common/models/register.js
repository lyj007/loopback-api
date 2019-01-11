'use strict';
const query = require('../../server/sqlquery');
const co = require('co');


module.exports = function(RegisterModel) {
  Object.assign(RegisterModel, {
    register(params, cb) {
      co(function* handler() {
        try { 
          yield RegisterModel.create({
            name: params.name,
            password: params.password,
            againpass: params.againpass,
            telephone: params.telephone,
            address: params.address,
          });
          cb(null, { meaasge: '注册成功', status: 200});
        } catch (e) {
          cb(e);
        }
      });
    },
    select(id, cb) {
      co(function* handler() {
        try { 
          const sql = `select * from register where id =${id}`;
          const connector = RegisterModel.dataSource.connector;
          connector.observe('after execute', (ctx, next) => {
            console.log('ctx---', ctx);
            // ctx.end(null);
             // 终止connector连接跳用
            next();
          });
          const data = yield query.request(connector, sql);
          cb(null, data);
        } catch (e) {
          cb(e);
        }
      });
    },
    // modify(id, newName, newPassword, cb) {
    //   co(function* handler() {
    //     try {
    //       const data = yield RegisterModel.findById(id);
    //       Object.assign(data, {
    //         name: newName,
    //         password: newPassword,
    //       });
    //       yield data.save();
    //       cb(null, prodata);
    //     } catch (e) {
    //       cb(e)
    //     }
    //   });
    // },
  });
  RegisterModel.observe('before save', (ctx, next) => {
    co(function* handler() {
      try {
        const where = {}
        const params = ctx.instance;
        if (params.telephone.toString().length !== 11) {
          const err = new Error('电话号码必须为11位');
          throw err;
        } else {
          const data = yield RegisterModel.find({where});
          const error = new Error('此号码已被注册过了');
          const error1 = new Error('此账号已被注册过了');
          error.statusCode = 400;
          error1.statusCode = 400;
          data.map(item => {
            if (item.telephone === params.telephone) {
              throw error;
            } else if (item.name === params.name) {
              throw error1;
            }
          });
          next();
        }
      } catch (e) {
        next(e);
      }
    });
  });
  RegisterModel.observe('after save', (ctx, next) => {
    co(function* handler() {
      try {
        const loginModel = RegisterModel.app.models.Login;
        const params = ctx.instance;
        yield loginModel.create({
          name: params.name,
          password: params.password,
        });
        next();
      } catch (e) {
        next(e);
      }
    });
  });
  RegisterModel.remoteMethod('register', {
    accepts: [
      {
        arg: 'params',
        type: 'object',
        description: '参数',
        http: {source: 'body'},
      },
    ],
    http: {verb: 'post', path: '/register'},
    returns: {arg: 'auth', type: 'string', root: true},
  });
  RegisterModel.remoteMethod('select', {
    accepts: [
      {
        arg: 'id',
        type: 'number',
        description: 'id',
        http: {source: 'query'},
      },
    ],
    http: {verb: 'get', path: '/slect'},
    returns: {arg: 'auth', type: 'string', root: true},
  });
};