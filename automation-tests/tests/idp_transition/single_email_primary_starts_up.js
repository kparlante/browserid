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
dialog = require('../../pages/dialog.js'),
runner = require('../../lib/runner.js'),
testSetup = require('../../lib/test-setup.js'),
// we use the WSAPI directly to create secondary users, as
// this test is focused on transition, and not user
// creation
// XXX: automation tests and api tests now share code, we should
// restructure.
wsapi = require('../../../tests/lib/wsapi.js'),
// tools for creating "secondary" users
secondary = require('../../../tests/lib/secondary.js');

// ensure that utilty libraries are using the proper server
wsapi.configuration.browserid = persona_urls.persona;

var browser;

var email1, email2;

runner.run(module, {
  "setup": function(done) {
    // XXX: allocate a testidp domain here
    testSetup.setup({browsers: 1}, function(err, fixtures) {
      if (fixtures) {
        browser = fixtures.browsers[0];
      }
      done(err);
    });
  },
  "disable idp so we can create secondary users": function(done) {
    // XXX
    done();
  },
  "create two secondary users using the domain": function(done) {
    email1 = 'test1@doesnotexist.testidp.org';
    email2 = 'test2@doesnotexist.testidp.org';

    secondary.create({
      email: email1,
      password: 'password',
      fetchVerificationLinkCallback: restmail.getVerificationLink
    }, function(err) {
      if (err) return done(err);
      secondary.create({
        email: email2,
        password: 'password',
        fetchVerificationLinkCallback: restmail.getVerificationLink
      }, done);
    });

  },
  "create a new selenium session": function(done) {
    testSetup.newBrowserSession(browser, done);
  },
  "enable primary support on our domain": function(done, el) {
    // XXX
    done();
  },
  "load 123done, spawn dialog, switch to it": function(done) {
    browser.chain()
      .get(persona_urls["123done"])
      .wclick(CSS['123done.org'].signinButton)
      .wwin(CSS["persona.org"].windowName, done);
  },
  "enter previously secondary email address": function(done) {
    broswer.chain()
      .wtype(CSS['dialog'].emailInput, email1)
      .wclick(CSS['dialog'].newEmailNextButton, done);
    // XXX: now we should be transitioned to the "this site
    // is now a primary" screen
  }
},
{
  suiteName: path.basename(__filename),
  cleanup: function(done) { testSetup.teardown(done) }
});
