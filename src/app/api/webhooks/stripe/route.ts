import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe webhook secret não configurado' },
      { status: 500 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        
        await prisma.user.update({
          where: {
            stripeCustomerId: session.customer,
          },
          data: {
            subscriptionStatus: 'premium',
            subscriptionId: session.subscription,
            subscriptionEndDate: new Date(session.current_period_end * 1000),
          },
        });
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        
        await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer,
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

// Configuração para aceitar raw body
export const config = {
  api: {
    bodyParser: false,
  },
}; 