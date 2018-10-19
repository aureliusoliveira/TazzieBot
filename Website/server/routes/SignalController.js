var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import User from "../models/User";
import PushNotification from '../functions'

router.post("/submit", function(req, res) {
    var userID = req.body.userID;
    var signal = req.body.signal;
})

router.post("/send/notification", function(req, res) {
    var notification_data = {
        payload: {
            title: 'One of your friends beat your record',
            body: 'Too bad, your friend '
        },
        device_token: "eJmHVWMHSZo:APA91bH4DyNCIQkTZVFMP2smoU0tyEeWacWY5IpXrPmFiBq-23CrPgfrl2rYYYHbejbbsbMhDyEM0cgWj48SIkwZ-FSh0RougK6WO8VbTlZAr9cPIQQLcEQOJDa4OEzF_j8xridgrkJa"
    };
    var payload = {
        notification: notification_data.payload
    };

    PushNotification.SendPushToDevice(notification_data.device_token, payload).then(result => {
        console.log('Everything went well', result);
        res.send(result);
    }).catch(err => {
        console.log('An error occurred', err);
        res.send(result);
    });

});

module.exports = router;