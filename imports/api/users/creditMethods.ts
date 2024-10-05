import { Meteor } from "meteor/meteor";

import { User } from "./UserProfile";

Meteor.methods({
  async setInitialCredit() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    const user = (await Meteor.users.findOneAsync(this.userId)) as User;
    if (user && !user.initialCreditReceived) {
      Meteor.users.updateAsync(this.userId, {
        $set: {
          credit: 1,
          initialCreditReceived: true,
        },
      });
    }
  },

  async setVerificationCredit() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    const user = (await Meteor.users.findOneAsync(this.userId)) as User;
    if (
      user &&
      !user.verificationCreditReceived &&
      user.emails &&
      user.emails[0].verified
    ) {
      Meteor.users.updateAsync(this.userId, {
        $set: {
          credit: 5,
          verificationCreditReceived: true,
        },
      });
    }
  },

  async useCredit() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    const user = await Meteor.users.findOneAsync(this.userId) as User;
    if (user && user.credit > 0) {
      await Meteor.users.updateAsync(this.userId, {
        $inc: { credit: -1 }
      });
      return true;
    } else {
      throw new Meteor.Error("insufficient-credit", "Not enough credit to perform this action");
    }
  }
});
