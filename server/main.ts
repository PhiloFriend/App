import { Meteor } from "meteor/meteor";
import { PhilosophyCollection } from "/imports/api/Philosophies";

import "../imports/api/Quiz";

import PHILOSOPHIES from "../imports/philosophies.json";

Meteor.startup(async () => {
  if (!(await PhilosophyCollection.countDocuments({}))) {
    PHILOSOPHIES.philosophies.forEach(async (philosophy) => {
      PhilosophyCollection.insertAsync(philosophy);
    });
  }
  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish("philosophies", function () {
    return PhilosophyCollection.find();
  });
});
