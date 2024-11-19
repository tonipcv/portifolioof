import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não está definido');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-10-28.acacia',
});

export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID; 