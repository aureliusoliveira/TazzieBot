const functions = require('firebase-functions');
const admin = require('firebase-admin'); // for accessing the realtime database
var serviceAccount = require("./tazziebot-firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tazziebot.firebaseio.com"
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.SendPushToDevice = function (device_token, payload) {
    return new Promise((resolve, reject) => {
        admin.messaging().sendToDevice(device_token, payload).then((res) => {
                var result = JSON.stringify({
                    'status': true,
                    'to': device_token,
                    'message': 'Notification sent!',
                    'payload': payload
                });
                return resolve(result)
                // inform the app that a notification was sent
            })
            .catch((error) => {
                var result = JSON.stringify({
                    'status': false,
                    'to': device_token,
                    'message': error.message,
                    'payload': payload
                });
                return reject(Error(result));
                // send the push notification error to the app
            });
    });
}

exports.PushSignal =
    functions.https.onRequest((request, response) => {
        if (request.method === 'POST') {
            var notification_data = {
                payload: {
                    title: 'One of your friends beat your record',
                    body: 'Too bad, your friend ' + current_user_data.user_name + ' just overtook you by ' + diff_steps + ' steps'
                },
                device_token: "fcXn0vlT_6M:APA91bFTR8J_mf6foelqKR3wPn2jau6-PTXM8O4vzrsAHnYrKLmEXID2g5yf1Mx_12E3REBYRkMv19Aifm1cgrY7kj2lrLrEbu1da4FC_7Z0ioLOJRW2xYfpxzYKCIsqlx7DfedpdzWS"
            };
            var payload = {
                notification: notification_data.payload
            };
            SendToDevice(notification_data.device_token, payload).then(result => {
                return response.send(result);
            }).catch(err => {
                return response.send(err);
            })
        }
    });