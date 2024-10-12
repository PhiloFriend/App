import { Meteor } from 'meteor/meteor';

export const getCurrentUserEmail = (): string => {
  const user = Meteor.user();
  if (!user) return '';

  console.log(user)

  if (user.services?.google?.email) {
    return user.services.google.email;
  } else if (user.emails && user.emails.length > 0) {
    return user.emails[0].address;
  }

  return '';
};

export const getCurrentUserId = (): string => {
  return Meteor.userId() || '';
};
