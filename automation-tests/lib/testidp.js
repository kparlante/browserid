var request = require('request'),
    restmail = require('./restmail.js');

const TESTIDP_API = 'https://testidp.org/api/';

// Compatible with Q.ncall
exports.qCreateIdP = function (cb) {
  request(TESTIDP_API + 'domain', function(err, response, body) {
    if (err) return cb(err);

    // resp would be 0
    var obj = {
      idp: JSON.parse(body)
    };

    // getRandomEmail() - allocate a random email on the testidp's domain
    obj.getRandomEmail = function() {
      return restmail.randomEmail(10, this.idp.domain + '.testidp.org');
    };

    // setWellKnown() - set the well-known document for the domain
    obj.setWellKnown = function(document, cb) {
      if (typeof document === 'object') document = JSON.stringify(document, null, 3);

      request.put({
        url: TESTIDP_API + this.idp.domain + "/well-known",
        json: true,
        body: document,
        headers: {
          'x-password': this.idp.password
        }
      }, function(err, response, body) {
        if (err) return cb(err);
        if (!body.ok) return cb(body.why);
        cb(err);
      });
    };

    obj.email = obj.getRandomEmail();

    cb(err, obj);
  });
};

function putJson(idp, params, api, cb) {
  put(idp, {json: params}, api, cb);
}
function putForm(idp, params, api, cb) {
  put(idp, {form: params}, api, cb);
}
function put(idp, opts, api, cb) {
  request(_.extend({
    url: 'https://testidp.org/api/' + idp.domain + '/' + api,
    method: 'PUT',
    headers: {
     'X-Password': idp.password
    },
    encoding: 'utf8'
  }, opts), cb);
}

exports.CreateIdP = function (idp) {
  return {
    putWellKnown: function (wellKnown, cb) {
      putJson(idp, wellKnown, 'well-known', cb);
    },
    putEnv: function (envUrl, cb) {
      putForm(idp, {env: envUrl}, 'env', cb);
    },
    putHeaders: function(name, value, cb) {
      var headers = {};
      headers[name] = value;
      putJson(idp, headers, 'headers', cb);
    },
    deleteIdp: function(idp, cb) {
      request({
        url: 'https://testidp.org/api/' + idp.domain,
        method: 'DELETE',
        headers: {
         'X-Password': idp.password
        },
        encoding: 'utf8'
      }, cb);
    }
  };
};
