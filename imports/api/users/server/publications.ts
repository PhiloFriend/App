import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  Meteor.publish('userData', function () {
    if (!this.userId) {
      return this.ready();
    }

    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          'services.google.verified_email': 1,
          'services.google.email': 1,
          'emails.verified': 1
        }
      }
    );
  });
}