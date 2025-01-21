import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Webhook secret não configurado');
    return NextResponse.json(
      { error: 'Webhook secret não configurado' },
      { status: 500 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    const session = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
      case 'checkout.session.completed': {
        const customerData = await stripe.customers.retrieve(
          session.customer as string
        ) as Stripe.Customer;

        await prisma.user.update({
          where: {
            email: customerData.email ?? '',
          },
          data: {
            stripeCustomerId: session.customer as string,
            subscriptionStatus: 'premium',
            subscriptionId: session.subscription as string,
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          },
        });
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerData = await stripe.customers.retrieve(
          subscription.customer as string
        ) as Stripe.Customer;

        await prisma.user.update({
          where: {
            email: customerData.email ?? '',
          },
          data: {
            subscriptionStatus: subscription.status === 'active' ? 'premium' : 'free',
            subscriptionEndDate: subscription.status === 'active'
              ? new Date(subscription.current_period_end * 1000)
              : null,
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 