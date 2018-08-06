"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Admin = require("../models/Admin");

var _Admin2 = _interopRequireDefault(_Admin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require("express");
var router = express.Router();
// import the models


/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.post("/login", function (req, res) {
  var password = req.body.password;
  var username = req.body.username;

  _Admin2.default.findOne({
    username: username,
    password: password
  }).then(function (admin) {
    if (admin == null) {
      res.status(512).send(username + " does not exist");
    } else {
      // admin != null
      if (admin.password != password) {
        res.status(512).send("Incorrect password for " + username);
      }
      res.json({
        userType: 'ADMIN',
        user: admin
      });
    }
  }).catch(function (err) {
    res.status(500).send(err.message);
  });
});

module.exports = router;