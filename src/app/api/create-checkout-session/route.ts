import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' }, 
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' }, 
        { status: 404 }
      );
    }

    // Verifica se já existe uma sessão de checkout ativa
    const existingSessions = await stripe.checkout.sessions.list({
      customer: user.stripeCustomerId || undefined,
      status: 'open',
      limit: 1,
    });

    if (existingSessions.data.length > 0) {
      // Retorna a URL da sessão existente
      return NextResponse.json({ url: existingSessions.data[0].url });
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

    // Criar nova sessão de checkout
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
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: 'Erro ao criar sessão de checkout' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Erro ao criar sessão de checkout:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao criar sessão de checkout',
        details: error.message 
      }, 
      { status: 400 }
    );
  }
} 