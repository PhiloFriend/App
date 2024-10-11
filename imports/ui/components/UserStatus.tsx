import React, { useEffect, ReactNode } from "react";
import { Meteor } from "meteor/meteor";
// @ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { User } from "/imports/api/users/UserProfile";

interface UserStatusProps {
  children: ReactNode;
}

export const UserStatus: React.FC<UserStatusProps> = ({ children }) => {
  const user = useTracker(() => Meteor.user() as User | null);

  useEffect(() => {
    console.log(
      "user",
      user,
      user &&
        user.emails &&
        user.emails[0].verified &&
        !user.verificationCreditReceived
    );

    if (
      user &&
      !user.initialCreditReceived &&
      !user.verificationCreditReceived
    ) {
      Meteor.call("setInitialCredit", (error: Error) => {
        if (error) {
          console.error("Error setting initial credit:", error);
        }
      });
    }

    if (
      user &&
      user.emails &&
      user.emails[0].verified &&
      !user.verificationCreditReceived
    ) {
      Meteor.call("setVerificationCredit", (error: Error) => {
        if (error) {
          console.error("Error setting verification credit:", error);
        }
      });
    }

    if (
      user &&
      user.services &&
      user.services.google &&
      user.services.google.verified_email &&
      !user.verificationCreditReceived
    ) {
      Meteor.call("setVerificationCredit", (error: Error) => {
        if (error) {
          console.error("Error setting verification credit:", error);
        }
      });
    }
  }, [user]);

  return <>{children}</>;
};
