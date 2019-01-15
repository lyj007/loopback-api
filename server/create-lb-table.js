'use strict';
/* eslint max-len: 0 */
const server = require('./server');
const ds = server.dataSources.db;
const lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'Person'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
  ds.disconnect();
});

