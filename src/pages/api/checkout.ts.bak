export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;

  try {
    const { priceId, productName } = await request.json();

    if (!priceId) {
      return new Response(JSON.stringify({ error: 'Missing priceId' }), { status: 400 });
    }

    // Create Stripe Checkout session
    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'payment_method_types[0]': 'card',
        'payment_method_types[1]': 'ideal',
        'success_url': 'https://creativesolace.com/success?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url': 'https://creativesolace.com/#kits',
        'shipping_address_collection[allowed_countries][0]': 'NL',
        'shipping_address_collection[allowed_countries][1]': 'BE',
        'shipping_address_collection[allowed_countries][2]': 'DE',
      }),
    });

    const session = await stripeRes.json() as any;

    if (session.error) {
      return new Response(JSON.stringify({ error: session.error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });

  } catch (err: any) {
    console.error('Checkout error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
