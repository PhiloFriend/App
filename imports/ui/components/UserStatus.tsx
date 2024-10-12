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
      Meteor.call("sendWelcomeEmail", (error: Error) => {
        if (error) {
          console.error("Error sending welcome email:", error);
        }
      });
    }

    console.log(
      user,
      user?.services,
      user?.services?.google,
      user?.services?.google?.verified_email,
      user?.verificationCreditReceived
    );

    if (
      user &&
      user.services &&
      user.services.google &&
      user.services.google.verified_email &&
      !user.verificationCreditReceived
    ) {
      console.log("are we here???");
      Meteor.call("setVerificationCredit", (error: Error) => {
        if (error) {
          console.error("Error setting verification credit:", error);
        }
      });
      console.log("what about here???");
      Meteor.call("sendWelcomeEmail", (error: Error) => {
        console.log('sending wel email as well?')
        if (error) {
          console.error("Error sending welcome email:", error);
        }
      });
    }
  }, [user]);

  return <>{children}</>;
};
