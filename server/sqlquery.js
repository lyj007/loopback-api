module.exports = {
  request(connector, sql) {
    return new Promise((resolve, reject) => {
      connector.query(sql, (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      });
    });
  },
  // 对request请求接受参数可能为数组或者是单个值的处理
  transferToList(input) {
    const output = [];
    if (typeof input === 'number') {
      output.push(input);
    } else {
      Array.prototype.push.apply(output, input);
    }
    return output;
  },
};