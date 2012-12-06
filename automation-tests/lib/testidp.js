var request = require('request'),
    restmail = require('./restmail.js');

// Compatible with Q.ncall
exports.qCreateIdP = function (cb) {
  request('https://testidp.org/api/domain', function(err, response, body) {
    if (err) return cb(err);

    // resp would be 0
    var obj = {
      idp: JSON.parse(body)
    };

    // getRandomEmail() - allocate a random email on the response object
    obj.getRandomEmail = function() {
      return restmail.randomEmail(10, this.idp.domain + '.testidp.org');
    };

    // setWellKnown() - set the well-known document for the domain
    obj.setWellKnown = function(docuemnt, cb) {
      // XXX : write me
      process.nextTick(function() { cb("not implemented"); });
    };

    obj.email = obj.getRandomEmail();

    cb(err, obj);
  });
};
