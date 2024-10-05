import { Meteor } from 'meteor/meteor';

export interface UserProfile {
  firstName: string;
  lastName: string;
}

export interface User extends Meteor.User {
  profile?: UserProfile;
  credit: number;
  initialCreditReceived?: boolean;
  verificationCreditReceived?: boolean;
}