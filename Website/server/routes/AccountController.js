var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import User from "../models/User";

router.post("/login", function(req, res) {
    var password = req.body.password;
    var username = req.body.username;

    User.findOne({
        username: username,
        password: password
    }).then(user => {
        if (user == null) {
            res.status(512).send(username + " does not exist");
        } else {
            res.json(user);
        }
    }).catch(err => {
        res.status(500).send(err.message);
    });
});

module.exports = router;