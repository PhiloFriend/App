import { Meteor } from "meteor/meteor";

if (Meteor.isServer) {
  Meteor.publish("userData", function () {
    if (!this.userId) {
      return this.ready();
    }

    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          "services.google.verified_email": 1,
          "services.google.email": 1,
          "emails.address": 1,
          "emails.verified": 1,
          credit: 1,
          profile: 1,
          initialCreditReceived: 1,
          verificationCreditReceived: 1,
          premiumTill: 1,
          subscriptionId: 1,
          isSubscribed: 1,
          subscriptionType: 1,
        },
      }
    );
  });
}
