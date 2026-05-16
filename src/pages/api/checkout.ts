export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;

  try {
    const { items, eventSlug, isTicket, ticketPrice } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), { status: 400 });
    }

    const params = new URLSearchParams({
      'mode': 'payment',
      'payment_method_types[0]': 'card',
      'payment_method_types[1]': 'ideal',
      'success_url': `https://creativesolace.com/success?session_id={CHECKOUT_SESSION_ID}${isTicket ? '&ticket=1&event=' + eventSlug : ''}`,
      'cancel_url': `https://creativesolace.com/#events`,
    });

    if (isTicket && eventSlug && ticketPrice) {
      // Ticket — use price_data (no pre-created Stripe product needed)
      params.append('line_items[0][price_data][currency]', 'eur');
      params.append('line_items[0][price_data][unit_amount]', String(Math.round(ticketPrice * 100)));
      params.append('line_items[0][price_data][product_data][name]', `Ticket — ${eventSlug.replace(/-/g, ' ')}`);
      params.append('line_items[0][quantity]', '1');
      params.append('metadata[eventSlug]', eventSlug);
      params.append('metadata[isTicket]', 'true');
    } else {
      // Kit purchase — use pre-created Stripe price IDs
      const itemsWithPrice = items.filter((i: any) => i.priceId);
      if (itemsWithPrice.length === 0) {
        return new Response(JSON.stringify({ error: 'No items with a valid price ID' }), { status: 400 });
      }
      itemsWithPrice.forEach((item: any, index: number) => {
        params.append(`line_items[${index}][price]`, item.priceId);
        params.append(`line_items[${index}][quantity]`, String(item.qty || 1));
      });
      // Only collect shipping for kit purchases
      params.append('shipping_address_collection[allowed_countries][0]', 'NL');
      params.append('shipping_address_collection[allowed_countries][1]', 'BE');
      params.append('shipping_address_collection[allowed_countries][2]', 'DE');
    }

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
