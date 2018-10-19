import Vue from 'nativescript-vue';

import router from './router';

import store from './store';
import moment from 'moment';

import './styles.scss';
import {
  Feedback,
  FeedbackType,
  FeedbackPosition
} from "nativescript-feedback";

import {
  TNSFontIcon,
  fonticon
} from "nativescript-fonticon";
TNSFontIcon.debug = true;

TNSFontIcon.paths = {
  fa: "./assets/FontAwesome.css",
  mdi: "./assets/MaterialIcons.css"
};
TNSFontIcon.loadCss();

var firebase = require("nativescript-plugin-firebase");
var appSettings = require("application-settings");

Vue.registerElement(
  "CardView",
  () => require("nativescript-cardview").CardView
);

Vue.registerElement(
  "Ripple",
  () => require("nativescript-ripple").Ripple
);
// Prints Vue logs when --env.production is *NOT* set while building

Vue.filter("fonticon", fonticon);
Vue.config.silent = (TNS_ENV === 'production');
Vue.prototype.$feedback = new Feedback();
Vue.mixin({
  data() {
    return {
      device_token: appSettings.getString("device_token")
    };
  },
  methods: {
    getMoment(value) {
      return moment(value);
    }
  },
  mounted() {
    firebase
      .init({
        onMessageReceivedCallback: message => {
          this.$feedback.success({
            title: message.title,
            duration: 4000,
            message: message.body
          });
          // if your server passed a custom property called 'foo', then do this:
          // console.log("Value of 'foo': " + message.data.foo);
        },
        onPushTokenReceivedCallback: token => {
          this.$feedback.success({
            title: "Got your access token",
            duration: 4000,
            message: token
          });
          appSettings.setString("device_token", token);
          this.device_token = token;
        }
      })
      .then(
        instance => {
          this.$feedback.success({
            title: "firebase.init done",
            duration: 4000
          });
        },
        err => {
          this.$feedback.success({
            title: "Firebase cannot connect",
            duration: 4000,
            message: err.message
          });
        }
      );

    this.$feedback.success({
      message: appSettings.getString("device_token")
    })

    if (appSettings.getString("device_token") == null) {
      firebase.getCurrentPushToken().then((token) => {
        appSettings.setString("device_token", token);
        this.device_token = token;
      });
    }
  }
})

new Vue({
  router,
  template: `<Frame><router-view/></Frame>`,
  store,
}).$start();