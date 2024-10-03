import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

if (Meteor.isServer) {
  (function () {
    "use strict";

    Accounts.urls.resetPassword = function (token) {
      return Meteor.absoluteUrl("reset-password/" + token);
    };

    Accounts.urls.verifyEmail = function (token) {
      return Meteor.absoluteUrl("verify-email/" + token);
    };

    Accounts.urls.enrollAccount = function (token) {
      return Meteor.absoluteUrl("enroll-account/" + token);
    };
  })();
}

Meteor.methods({
  async sendVerificationEmail() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    const user = await Meteor.users.findOneAsync(this.userId);
    if (user && user.emails && user.emails[0] && !user.emails[0].verified) {
      Accounts.sendVerificationEmail(this.userId);
    }
  },

  async sendResetPasswordEmail(email: string) {
    const user = await Meteor.users.findOneAsync({ "emails.address": email });
    if (user) {
      Accounts.sendResetPasswordEmail(user._id);
    } else {
      throw new Meteor.Error("user-not-found", "No user found with that email address");
    }
  },
});
