import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export interface PhilosophyType {
  _id?: string;
  id: string;
  name: string;
  category: string;
  summary: string;
}

export const PhilosophyCollection = new Mongo.Collection<PhilosophyType>("philosophies");
