import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { Reflection } from "./types";

export const ReflectionCollection = new Mongo.Collection<Reflection>(
  "reflection"
);

if (Meteor.isServer) {
  Meteor.publish("reflection", function (reflectionId: string) {
    if (!this.userId) {
      return this.ready();
    }
    return ReflectionCollection.find({
      _id: reflectionId,
      owner: this.userId,
    });
  });

  Meteor.publish("userReflections", function (limit = 10) {
    if (!this.userId) {
      return this.ready();
    }
    return ReflectionCollection.find(
      { owner: this.userId },
      {
        limit: limit,
        sort: { createdAt: -1 },
        fields: {
          reflectionText: 1,
          reflectionType: 1,
          result: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      }
    );
  });
}
