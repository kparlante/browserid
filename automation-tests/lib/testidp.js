var request = require('request');

// Compatible with Q.ncall
exports.qCreateIdP = function (cb) {
  request('https://testidp.org/api/domain', cb);
};