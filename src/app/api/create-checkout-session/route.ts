import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse('Usuário não encontrado', { status: 404 });
    }

    // Verificar se já existe uma assinatura ativa
    if (user.subscriptionStatus === 'premium') {
      return new NextResponse('Usuário já possui assinatura premium', { status: 400 });
    }

    // Criar ou recuperar cliente no Stripe
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });
      
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });
      
      stripeCustomerId = customer.id;
    }

    // Criar sessão de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: {
        userId: user.id,
      },
    });

    if (!checkoutSession.url) {
      return new NextResponse('Erro ao criar sessão de checkout', { status: 500 });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 