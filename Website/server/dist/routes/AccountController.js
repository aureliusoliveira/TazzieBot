"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require("express");
var router = express.Router();
// import the models


router.post("/login", function (req, res) {
    var password = req.body.password;
    var username = req.body.username;

    _User2.default.findOne({
        username: username,
        password: password
    }).then(function (user) {
        if (user == null) {
            res.status(512).send(username + " does not exist");
        } else {
            res.json(user);
        }
    }).catch(function (err) {
        res.status(500).send(err.message);
    });
});

module.exports = router;