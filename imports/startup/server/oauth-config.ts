import { ServiceConfiguration } from "meteor/service-configuration";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { setCredit } from '../../api/users/creditFunctions';

Accounts.onCreateUser((options, user) => {
  if (user.services?.google) {
    // This is a Google login
    setCredit(user._id, 5);
  } else {
    // For non-Google signups, we'll set the credit in the signup process
    setCredit(user._id, 1);
  }

  // Don't forget to return the user object at the end of this function
  return user;
});

Meteor.startup(async () => {
  await ServiceConfiguration.configurations.upsertAsync(
    { service: "google" },
    {
      $set: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
        loginStyle: "popup",
      },
    }
  );
});
