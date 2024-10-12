import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import { handleStripeWebhook } from "./stripe-integration";
import Stripe from "stripe";
import getRawBody from "raw-body";
// @ts-ignore
import { Log } from "meteor/logging";
import {
  setUserSubscription,
  updateUserSubscriptionType,
  updateUserPremiumTill,
} from "../users/methods";

const stripe = new Stripe("1");
const endpointSecret =
  "whsec_6d5b9d7920fd16fcbadda41b1044b967c10486a23e70980fc3edfe8014bcf768"; //Meteor.settings.private.stripeWebhookSecret;

WebApp.rawHandlers.use("/stripe-webhook", async (req, res) => {
  let event;

  try {
    const rawBody = await getRawBody(req);

    const sig = req.headers["stripe-signature"] as string;
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);

    console.log("Received event:", event.type);
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook Error: ${error.message}`);
    res.writeHead(400);
    res.end(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type) {
    case "invoice.paid":
      const paidInvoice = event.data.object as Stripe.Invoice;
      const subscriptionIdFromInvoice = paidInvoice.subscription as string;
      
      try {
        await updateUserPremiumTill(subscriptionIdFromInvoice);
        console.log(`Updated premium till for subscription ${subscriptionIdFromInvoice}`);
      } catch (error) {
        console.error(`Error updating user premium till: ${error}`);
      }
      break;

    case "checkout.session.completed":
      const checkout = event.data.object as Stripe.Checkout.Session;
      const userId = checkout.client_reference_id;
      const subscriptionIdInSession = checkout.subscription as string;

      if (userId && subscriptionIdInSession) {
        try {
          await setUserSubscription(userId, subscriptionIdInSession);
          console.log(
            `Updated subscription for user ${userId}: ${subscriptionIdInSession}`
          );
        } catch (error) {
          console.error(`Error updating user subscription type: ${error}`);
        }
      } else {
        console.error("Missing userId or subscriptionId in checkout session");
      }
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;
      const subscriptionId = subscription.id;

      try {
        await updateUserSubscriptionType(subscriptionId, priceId);
        console.log(
          `Updated subscription type for subscription ${subscriptionId}`
        );
      } catch (error) {
        console.error(`Error updating user subscription type: ${error}`);
      }
      break;

    // Add more event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.writeHead(200);
  res.end();
});
