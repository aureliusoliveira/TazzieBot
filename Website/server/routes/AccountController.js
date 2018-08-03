var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Admin from "../models/Admin";

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

  Admin.findOne({
    username: username,
    password: password
  }).then(admin => {
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
  }).catch(err => {
    res.status(500).send(err.message);
  });
});

module.exports = router;