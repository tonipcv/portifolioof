import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    return NextResponse.json({ rate: data.rates.BRL });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return NextResponse.json({ rate: 5.00 }); // Fallback rate
  }
} 