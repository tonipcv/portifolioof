import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
    console.log('Ambiente:', process.env.NODE_ENV);
    console.log('Price ID:', priceId);

    if (!priceId) {
      return NextResponse.json(
        { error: 'STRIPE_PREMIUM_PRICE_ID não configurado' },
        { status: 500 }
      );
    }

    try {
      await stripe.prices.retrieve(priceId);
    } catch (priceError) {
      console.error('Erro ao verificar price:', priceError);
      return NextResponse.json(
        { error: 'Price ID inválido ou não encontrado' },
        { status: 500 }
      );
    }

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

    let stripeCustomerId = user.stripeCustomerId;
    
    if (stripeCustomerId?.startsWith('cus_') && process.env.NODE_ENV === 'production') {
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: null },
      });
      stripeCustomerId = null;
    }

    if (!stripeCustomerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email!,
          name: user.name || undefined,
          metadata: {
            userId: user.id,
            environment: process.env.NODE_ENV,
          },
        });
        
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customer.id },
        });
        
        stripeCustomerId = customer.id;
      } catch (error) {
        console.error('Erro ao criar cliente Stripe:', error);
        return NextResponse.json(
          { error: 'Erro ao criar cliente no Stripe' },
          { status: 500 }
        );
      }
    }

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
        metadata: {
          userId: user.id,
          environment: process.env.NODE_ENV,
        },
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        allow_promotion_codes: true,
      });

      if (!checkoutSession.url) {
        return NextResponse.json(
          { error: 'URL da sessão de checkout não gerada' }, 
          { status: 500 }
        );
      }

      return NextResponse.json({ url: checkoutSession.url });
    } catch (checkoutError: any) {
      console.error('Erro específico ao criar sessão:', {
        error: checkoutError.message,
        type: checkoutError.type,
        code: checkoutError.code,
        priceId: priceId,
        environment: process.env.NODE_ENV
      });
      
      return NextResponse.json(
        { 
          error: 'Erro ao criar sessão de checkout',
          details: checkoutError.message,
          code: checkoutError.code
        }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erro geral:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao criar sessão de checkout',
        details: error.message 
      }, 
      { status: 400 }
    );
  }
} 