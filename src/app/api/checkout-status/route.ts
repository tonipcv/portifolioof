import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID não fornecido' },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return NextResponse.json({
      status: session.status,
      customer: session.customer,
      subscription: session.subscription,
    });
  } catch (error) {
    console.error('Erro ao verificar status do checkout:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar status do checkout' },
      { status: 500 }
    );
  }
} 