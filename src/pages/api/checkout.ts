export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;

  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), { status: 400 });
    }

    const itemsWithPrice = items.filter((i: any) => i.priceId);
    if (itemsWithPrice.length === 0) {
      return new Response(JSON.stringify({ error: 'No items with a valid price ID' }), { status: 400 });
    }

    const params = new URLSearchParams({
      'mode': 'payment',
      'payment_method_types[0]': 'card',
      'payment_method_types[1]': 'ideal',
      'success_url': 'https://creativesolace.com/success?session_id={CHECKOUT_SESSION_ID}',
      'cancel_url': 'https://creativesolace.com/#kits',
      'shipping_address_collection[allowed_countries][0]': 'NL',
      'shipping_address_collection[allowed_countries][1]': 'BE',
      'shipping_address_collection[allowed_countries][2]': 'DE',
    });

    itemsWithPrice.forEach((item: any, index: number) => {
      params.append(`line_items[${index}][price]`, item.priceId);
      params.append(`line_items[${index}][quantity]`, String(item.qty || 1));
    });

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
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
