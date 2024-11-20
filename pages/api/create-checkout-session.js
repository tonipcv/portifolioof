export default async function handler(req, res) {
  try {
    // Add error handling and logging
    const session = await stripe.checkout.sessions.create({
      // Make sure all required parameters are present
      line_items: [...],
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ 
      error: 'Error creating checkout session',
      details: error.message 
    });
  }
} 