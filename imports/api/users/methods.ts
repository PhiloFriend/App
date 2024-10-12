import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { setVerifiedCredit } from "./creditFunctions";
import { check } from "meteor/check";
import { getConfig } from "../../config";
import { Email } from "meteor/email";
import { User } from "./UserProfile";

const config = getConfig();

if (Meteor.isServer) {
  (function () {
    "use strict";

    Accounts.urls.resetPassword = function (token) {
      return Meteor.absoluteUrl("reset-password/" + token);
    };

    Accounts.urls.verifyEmail = function (token) {
      return Meteor.absoluteUrl("verify-email/" + token);
    };

    Accounts.urls.enrollAccount = function (token) {
      return Meteor.absoluteUrl("enroll-account/" + token);
    };
  })();
}

const createEmailHTML = (content: string) => `
<html>
  <head>
    <style>
      body { font-family: sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { text-align: center; margin-bottom: 20px; }
      .magic-text { color: #6a0dad; font-style: italic; }
      .btn { display: inline-block; padding: 10px 20px; background-color: #252422; color: #fff !important; text-decoration: none; border-radius: 5px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${config.headerImageUrl}" alt="PhiloFriend" style="max-width: 100%; height: auto;">
      </div>
      ${content}
      <p>The PhiloFriend Team 🧙‍♂️</p>
    </div>
  </body>
</html>
`;

const sendWelcomeEmail = async (userId: string) => {
  const user = await Meteor.users.findOneAsync(userId) as User;
  if (
    !user ||
    ((!user?.emails || !user.emails[0].address) &&
      !user.services?.google?.email) ||
    user.welcomeEmailSent
  )
    return;

  const email = user.services?.google?.email
    ? user.services?.google?.email
    : user?.emails?.[0].address;

  console.log("sending welcome email to user: ", email);

  const content = `
    <h1>Greetings, Wisdom Wanderer!</h1>
    <p>Welcome to <span class="magic-text">PhiloFriend</span>!</p>
    <p>We're thrilled to have you join our circle of thinkers and explorers. At PhiloFriend, we believe that every reflection is a step toward uncovering the mysteries within ourselves.</p>
    <p>Just as ancient alchemists transformed simple elements into gold, we're here to guide you on a transformative journey of self-discovery and enlightenment.</p>
    <h2>What's New on Your Magical Journey:</h2>
    <ul>
      <li><strong>Reflect and Evolve:</strong> Dive deep into your emotions with our interactive quizzes, unlocking wise and magical stories tailored just for you.</li>
      <li><strong>Track Your Growth Over Time:</strong> Watch your reflections weave a tapestry of personal insights, revealing patterns and guiding your path forward.</li>
      <li><strong>Personalized Growth Plans:</strong> Receive custom-tailored plans designed to help you harness your inner magic and achieve your fullest potential.</li>
    </ul>
    <p>Ready to embark on this extraordinary adventure?</p>
    <p style="text-align: center;">
      <a href="${Meteor.absoluteUrl(
        "reflect"
      )}" class="btn">Begin Your Journey Now</a>
    </p>
    <p>Should you need guidance or have questions along the way, we're here for you. Feel free to reach out at any time.</p>
    <p>May your path be illuminated with wisdom and wonder!</p>
  `;

  try {
    await Email.sendAsync({
      to: email,
      from: "PhiloFriend <alchemist@philofriend.com>",
      subject: "✨ Welcome to PhiloFriend – Your Journey Begins Here!",
      html: createEmailHTML(content),
    });

    // Set welcomeEmailSent to true after successfully sending the email
    await Meteor.users.updateAsync(userId, {
      $set: { welcomeEmailSent: true }
    });

    console.log(`Welcome email sent and flag set for user: ${userId}`);
  } catch (error) {
    console.error(`Error sending welcome email to user ${userId}:`, error);
  }
};

const sendPremiumWelcomeEmail = async (userId: string) => {
  const user = await Meteor.users.findOneAsync(userId) as User;
  if (!user || (!user?.emails && !user.services?.google?.email)) return;

  const email = user.services?.google?.email
    ? user.services.google.email
    : user.emails?.[0].address;

  console.log("Sending premium welcome email to user: ", email);

  const content = `
    <h1>✨ Your PhiloFriend Alchemist Plan is Activated! ✨</h1>
    <p>Greetings, Alchemist!</p>
    <p>Congratulations on upgrading to the <strong>PhiloFriend Alchemist Plan</strong>! You now have access to 100 credits each month, unlocking a world of personalized reflections, exclusive wisdom stories, growth tracking, and custom-tailored growth plans.</p>
    <h2>What's Now Available to You:</h2>
    <ul>
      <li><strong>Reflect and Evolve:</strong> Engage with interactive quizzes and magical stories crafted just for your journey.</li>
      <li><strong>Beta Features Coming Soon:</strong>
        <ul>
          <li><strong>Track Your Growth Over Time:</strong> Visualize your reflections and uncover patterns that guide your path forward.</li>
          <li><strong>Personalized Growth Plans:</strong> Receive bespoke plans to harness your inner magic and achieve your fullest potential.</li>
        </ul>
      </li>
      <li><strong>Priority Support:</strong> Get swift assistance from our dedicated support wizards.</li>
    </ul>
    <p>As a valued Alchemist, you'll receive exclusive beta access to these new features as soon as they're ready, allowing you to be among the first to experience enhanced growth and transformation tools.</p>
    <p>Ready to dive deeper into your transformation?</p>
    <p style="text-align: center;">
      <a href="${Meteor.absoluteUrl("reflect")}" class="btn">Begin Your Journey Now</a>
    </p>
    <p>Thank you for choosing PhiloFriend. May your journey be filled with wisdom and wonder!</p>
    <p>Warm regards,</p>
  `;

  try {
    await Email.sendAsync({
      to: email,
      from: "PhiloFriend <alchemist@philofriend.com>",
      subject: "✨ Your PhiloFriend Alchemist Plan is Activated! ✨",
      html: createEmailHTML(content),
    });

    console.log(`Premium welcome email sent to user: ${userId}`);
  } catch (error) {
    console.error(`Error sending premium welcome email to user ${userId}:`, error);
  }
};

Meteor.methods({
  async sendVerificationEmail() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    const user = await Meteor.users.findOneAsync(this.userId);
    if (user && user.emails && user.emails[0] && !user.emails[0].verified) {
      Accounts.sendVerificationEmail(this.userId);
    }
  },

  async sendResetPasswordEmail(email: string) {
    const user = await Meteor.users.findOneAsync({ "emails.address": email });
    if (user) {
      Accounts.sendResetPasswordEmail(user._id);
    } else {
      throw new Meteor.Error(
        "user-not-found",
        "No user found with that email address"
      );
    }
  },

  async updateUserProfile(profileData: { acceptEmails?: boolean }) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    check(profileData, {
      acceptEmails: Boolean,
    });

    await Meteor.users.updateAsync(this.userId, {
      $set: {
        "profile.acceptEmails": profileData.acceptEmails,
      },
    });
  },

  async sendWelcomeEmail() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    if (Meteor.isServer) {
      sendWelcomeEmail(this.userId);
    }
  },
});

export const setUserSubscription = async (
  userId: string,
  subscriptionId: string
) => {
  check(userId, String);
  check(subscriptionId, String);

  const user = await Meteor.users.findOneAsync(userId);

  if (!user) {
    throw new Meteor.Error("user-not-found", "User not found");
  }

  await Meteor.users.updateAsync(userId, {
    $set: {
      subscriptionId: subscriptionId,
      isSubscribed: true,
    },
  });

  // Send premium welcome email
  await sendPremiumWelcomeEmail(userId);
};

export const updateUserSubscriptionType = async (
  subscriptionId: string,
  priceId: string
) => {
  check(subscriptionId, String);
  check(priceId, String);

  let subscriptionType: "monthly" | "yearly";

  if (priceId === process.env.MONTHLY_PRICE_ID) {
    subscriptionType = "monthly";
  } else if (priceId === process.env.YEARLY_PRICE_ID) {
    subscriptionType = "yearly";
  } else {
    throw new Meteor.Error("invalid-price-id", "Invalid price ID");
  }

  const user = await Meteor.users.findOneAsync({
    subscriptionId: subscriptionId,
  });

  if (!user) {
    throw new Meteor.Error(
      "user-not-found",
      "No user found with the given subscription ID"
    );
  }

  await Meteor.users.updateAsync(
    { _id: user._id },
    {
      $set: {
        subscriptionId: subscriptionId,
        isSubscribed: true,
        subscriptionType: subscriptionType,
      },
    }
  );
};

export const updateUserPremiumTill = async (subscriptionId: string) => {
  check(subscriptionId, String);

  const user = (await Meteor.users.findOneAsync({
    subscriptionId: subscriptionId,
  })) as User;

  if (!user) {
    throw new Meteor.Error(
      "user-not-found",
      "No user found with the given subscription ID"
    );
  }

  const subscriptionType = user.subscriptionType;

  if (!subscriptionType) {
    throw new Meteor.Error(
      "subscription-type-not-found",
      "Subscription type not found for the user"
    );
  }

  const currentDate = new Date();
  let newPremiumTill: Date;

  if (user.premiumTill && user.premiumTill > currentDate) {
    // If there's an existing future date, add to it
    newPremiumTill = new Date(user.premiumTill);
  } else {
    // Otherwise, start from now
    newPremiumTill = new Date();
  }

  // Add the appropriate time based on subscription type
  if (subscriptionType === "yearly") {
    newPremiumTill.setFullYear(newPremiumTill.getFullYear() + 1);
  } else if (subscriptionType === "monthly") {
    newPremiumTill.setMonth(newPremiumTill.getMonth() + 1);
  } else {
    throw new Meteor.Error(
      "invalid-subscription-type",
      "Invalid subscription type"
    );
  }

  await Meteor.users.updateAsync(
    { _id: user._id },
    {
      $set: {
        premiumTill: newPremiumTill,
        credit: 100,
      },
    }
  );
};
