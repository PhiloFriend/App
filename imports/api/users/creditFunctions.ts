import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

export const setCredit = async (userId: string, amount: number) => {
  check(userId, String);
  check(amount, Number);

  return await Meteor.users.updateAsync(userId, {
    $set: { credit: amount },
  });
};

export const incrementCredit = async (userId: string, amount: number) => {
  check(userId, String);
  check(amount, Number);

  return await Meteor.users.updateAsync(userId, {
    $inc: { credit: amount },
  });
};

export const setInitialCredit = async (userId: string) => {
  await setCredit(userId, 1);
};

export const setVerifiedCredit = async (userId: string) => {
  await setCredit(userId, 5);
};
