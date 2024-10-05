import { Meteor } from "meteor/meteor";
import { PhilosophyCollection } from "/imports/api/Philosophies";
import {
  setCredit,
  setVerifiedCredit,
} from "../imports/api/users/creditFunctions";

import "../imports/api/Quiz";
import "../imports/api/ReflectionQuiz";
import "../imports/api/Reflection";
import "../imports/api/users/methods";
import "../imports/api/users/server/publications";
import "../imports/api/users/creditMethods";  // Add this line
import "../imports/startup/server/oauth-config";

import PHILOSOPHIES from "../imports/philosophies.json";

import { Accounts } from "meteor/accounts-base";

Meteor.startup(async () => {
  if (!(await PhilosophyCollection.countDocuments({}))) {
    PHILOSOPHIES.philosophies.forEach(async (philosophy) => {
      PhilosophyCollection.insertAsync(philosophy);
    });
  }

  Accounts.emailTemplates.from = "PhiloFriend <no-reply@philofriend.com>";

  const headerImageUrl =
    "https://philofriend.s3.eu-north-1.amazonaws.com/images/email.png";

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
          <img src="${headerImageUrl}" alt="PhiloFriend" style="max-width: 100%; height: auto;">
        </div>
        ${content}
        <p>May wisdom and wonder guide your path,</p>
        <p>The PhiloFriend Team 🧙‍♂️</p>
      </div>
    </body>
  </html>
`;

  // Customize verification email
  Accounts.emailTemplates.verifyEmail = {
    subject() {
      return "🔮 Unveil Your Wisdom Portal: Verify Your PhiloFriend Email";
    },
    text(user, url) {
      return (
        `Greetings, Seeker of Wisdom!\n\n` +
        `Your journey with PhiloFriend is about to begin. But first, we must ensure you're ready to receive the arcane knowledge that awaits.\n\n` +
        `Verify your email by clicking this mystical link:\n${url}\n\n` +
        `Once done, prepare to unlock the secrets of the universe, tailored just for you.\n\n` +
        `May wisdom and wonder guide your path,\n` +
        `The PhiloFriend Team 🧙‍♂️`
      );
    },
    html(user, url) {
      const content = `
        <h1>Greetings, Seeker of Wisdom!</h1>
        <p>Your journey with <span class="magic-text">PhiloFriend</span> is about to begin. But first, we must ensure you're ready to receive the arcane knowledge that awaits.</p>
        <p>Verify your email by clicking this button:</p>
        <p style="text-align: center;">
          <a href="${url}" class="btn">Verify your email</a>
        </p>
        <p>Once done, prepare to unlock the secrets of the universe, tailored just for you.</p>
      `;
      return createEmailHTML(content);
    },
  };

  // Customize reset password email
  Accounts.emailTemplates.resetPassword = {
    subject() {
      return "🗝️ Reforge Your Mystical Key: Reset Your PhiloFriend Password";
    },
    text(user, url) {
      return (
        `Greetings, Master of Forgotten Secrets!\n\n` +
        `Fear not, for even the greatest sages sometimes misplace their keys to wisdom.\n\n` +
        `To forge a new key to your PhiloFriend sanctum, click this enchanted link:\n${url}\n\n` +
        `Remember, with great power comes great responsibility. Guard your new password as you would your most precious magical artifact.\n\n` +
        `May wisdom and wonder guide your path,\n` +
        `The PhiloFriend Team 🧙‍♂️`
      );
    },
    html(user, url) {
      const content = `
        <h1>Greetings, Master of Forgotten Secrets!</h1>
        <p>Fear not, for even the greatest sages sometimes misplace their keys to wisdom.</p>
        <p>To forge a new key to your <span class="magic-text">PhiloFriend</span> sanctum, click this enchanted button:</p>
        <p style="text-align: center;">
          <a href="${url}" class="btn">Reset your password</a>
        </p>
        <p>Remember, with great power comes great responsibility. Guard your new password as you would your most precious magical artifact.</p>
      `;
      return createEmailHTML(content);
    },
  };

  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish("philosophies", function () {
    return PhilosophyCollection.find();
  });
});
