import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { handleStripeWebhook } from './stripe-integration';

WebApp.handlers.use('/stripe-webhook', (req, res) => {
  // Verify Stripe webhook signature
  // Parse the event
  // Call handleStripeWebhook with the parsed event
  // Send appropriate response

  console.log(req, res)
});