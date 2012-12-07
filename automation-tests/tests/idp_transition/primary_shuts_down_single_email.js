#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
path = require('path'),
assert = require('../../lib/asserts.js'),
restmail = require('../../lib/restmail.js'),
utils = require('../../lib/utils.js'),
persona_urls = require('../../lib/urls.js'),
CSS = require('../../pages/css.js'),
CreateIdP = require('../../lib/testidp.js').CreateIdP,
dialog = require('../../pages/dialog.js'),
runner = require('../../lib/runner.js'),
testSetup = require('../../lib/test-setup.js');

var browser, testUser, testIdp;

runner.run(module, {
  "setup": function(done) {
    testSetup.setup({browsers: 1, testidps: 1}, function(err, fixtures) {
      if (fixtures) {
        browser = fixtures.browsers[0];
        var llIdP = fixtures.testidps[0];
        testIdp = new CreateIdP(llIdP.idp);
        testUser = llIdP.getRandomEmail();
      }
      done(err);
    });
  },
  "create a new selenium session": function(done) {
    testSetup.newBrowserSession(browser, done);
  },
  "load 123done and wait for the signin button to be visible": function(done) {
    browser.get(persona_urls["123done"], done);
  },
  "click the signin button": function(done, el) {
    browser.wclick(CSS['123done.org'].signinButton, done);
  },
  "switch to the dialog when it opens": function(done) {
    browser.wwin(CSS["persona.org"].windowName, done);
  },
  "Happy, healthy primary": function (done) {
    testIdp.putWellKnown(testIdp.getNoAuth(), true, function (err, resp, body) {
      testIdp.putEnv(persona_urls['persona'] + '/', done);
    });
  },
  "Sign in": function (done) {
    browser.chain({onError: done})
      .wtype(CSS['dialog'].emailInput, testUser)
      .wclick(CSS['dialog'].newEmailNextButton, done);
  }
},
{
  suiteName: path.basename(__filename),
  cleanup: function(done) { testSetup.teardown(done) }
});
