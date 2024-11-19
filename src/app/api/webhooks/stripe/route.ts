import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature') ?? '';

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

    console.log('Evento recebido:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      console.log('Dados da sessão:', session);

      // Buscar usuário pelo customer ID
      const customer = await stripe.customers.retrieve(session.customer as string);
      console.log('Dados do cliente:', customer);

      if (!customer.email) {
        throw new Error('Email do cliente não encontrado');
      }

      // Atualizar usuário usando o email
      const updatedUser = await prisma.user.update({
        where: {
          email: customer.email,
        },
        data: {
          stripeCustomerId: session.customer,
          subscriptionStatus: 'premium',
          subscriptionId: session.subscription,
          subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        },
      });

      console.log('Usuário atualizado:', updatedUser);
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as any;
      console.log('Dados da assinatura:', subscription);

      const customer = await stripe.customers.retrieve(subscription.customer as string);
      
      if (!customer.email) {
        throw new Error('Email do cliente não encontrado');
      }

      await prisma.user.update({
        where: {
          email: customer.email,
        },
        data: {
          subscriptionStatus: subscription.status === 'active' ? 'premium' : 'free',
          subscriptionEndDate: subscription.status === 'active' 
            ? new Date(subscription.current_period_end * 1000)
            : null,
        },
      });
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