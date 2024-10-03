import { ServiceConfiguration } from "meteor/service-configuration";
import { Meteor } from "meteor/meteor";

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
