export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  // For now log the event — add webhook secret verification after go-live
  try {
    const event = JSON.parse(body);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name;
      const amount = (session.amount_total / 100).toFixed(2);

      // Save order to D1
      await env.DB.prepare(
        `INSERT INTO orders (stripe_session_id, customer_email, customer_name, amount, status, created_at)
         VALUES (?, ?, ?, ?, 'paid', datetime('now'))`
      ).bind(session.id, customerEmail, customerName, amount).run();

      // Send order confirmation
      await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': env.POSTMARK_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          From: `Creative Solace <${env.POSTMARK_FROM}>`,
          To: customerEmail,
          Subject: `💎 Your order is confirmed! — Creative Solace`,
          HtmlBody: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #FF6B9D;">Order confirmed! 💎</h2>
              <p>Hi ${customerName},</p>
              <p>Thank you for your order! Your rhinestone kit is being prepared with love and will ship within 1–2 business days.</p>
              <p><strong>Total paid: €${amount}</strong></p>
              <p>We'll send you tracking information as soon as your package is on its way. ✨</p>
              <p>With sparkle,<br><strong>Creative Solace</strong></p>
            </div>
          `,
        }),
      });

      // Notify hello@
      await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': env.POSTMARK_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          From: `Creative Solace <${env.POSTMARK_FROM}>`,
          To: env.POSTMARK_FROM,
          Subject: `🛍️ New order — €${amount} — ${customerName}`,
          HtmlBody: `
            <div style="font-family: sans-serif;">
              <h2>New Order 🛍️</h2>
              <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
              <p><strong>Amount:</strong> €${amount}</p>
              <p><strong>Session ID:</strong> ${session.id}</p>
              <p>Ship within 1–2 business days!</p>
            </div>
          `,
        }),
      });
    }

    return new Response('ok', { status: 200 });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};
