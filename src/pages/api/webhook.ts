export const prerender = false;

import type { APIRoute } from 'astro';

const LOGO_URL = 'https://pub-6faae82249d24e62b02dd40b5cc74d40.r2.dev/CS_LOGO.png';

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Creative Solace</title>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:32px 16px;">
  <tr><td align="center">
    <table width="540" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8ddd4;max-width:540px;width:100%;">

      <tr>
        <td style="background:#1A0A14;padding:28px 32px;text-align:center;">
          <img src="${LOGO_URL}" alt="Creative Solace" height="56" style="display:block;margin:0 auto;height:56px;"/>
        </td>
      </tr>

      <tr>
        <td style="background:linear-gradient(135deg,#FFD166 0%,#FF9EC4 50%,#C084FC 100%);height:4px;font-size:0;line-height:0;">&nbsp;</td>
      </tr>

      ${content}

      <tr>
        <td style="padding:20px 40px;text-align:center;border-top:1px solid #f0e8e0;">
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#3D1A2C;margin:0 0 4px;">With sparkle,</p>
          <p style="font-family:Georgia,serif;font-size:15px;font-weight:700;color:#1A0A14;margin:0 0 12px;">Creative Solace</p>
          <p style="margin:0 0 12px;">
            <a href="https://instagram.com/creativesolace__" style="font-family:Arial,sans-serif;font-size:11px;color:#FF6B9D;text-decoration:none;margin:0 6px;">Instagram</a>
            <a href="https://tiktok.com/@creativesolace_" style="font-family:Arial,sans-serif;font-size:11px;color:#FF6B9D;text-decoration:none;margin:0 6px;">TikTok</a>
            <a href="https://facebook.com/creativesolace" style="font-family:Arial,sans-serif;font-size:11px;color:#FF6B9D;text-decoration:none;margin:0 6px;">Facebook</a>
          </p>
          <p style="font-family:Arial,sans-serif;font-size:10px;color:#aaaaaa;margin:0;">Creative Solace &mdash; KVK 93777337 &mdash; Made with love in the Netherlands</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

const orderConfirmationEmail = (
  customerName: string,
  lineItems: { name: string; price: string }[],
  totalAmount: string,
  shippingName: string,
  shippingCity: string
) => emailWrapper(`
  <tr>
    <td style="padding:32px 40px 24px;border-bottom:1px solid #f0e8e0;">
      <p style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#1A0A14;margin:0 0 4px;line-height:1.2;">Your order is confirmed!</p>
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#5C3049;margin:0;font-style:italic;">Jouw bestelling is bevestigd!</p>
    </td>
  </tr>

  <tr>
    <td style="padding:24px 40px;border-bottom:1px solid #f0e8e0;">
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#3D1A2C;line-height:1.7;margin:0 0 10px;">Hi <strong>${customerName}</strong>,</p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#3D1A2C;line-height:1.7;margin:0 0 10px;">Thank you so much for your order! Your rhinestone kit is being prepared with love and will ship within 1 to 2 business days.</p>
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#5C3049;line-height:1.7;margin:0 0 20px;font-style:italic;">Bedankt voor je bestelling! Je rhinestone kit wordt met liefde ingepakt en verstuurd binnen 1 tot 2 werkdagen.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
        ${lineItems.map(item => `
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:13px;color:#3D1A2C;padding:8px 0;border-bottom:1px solid #f0e8e0;">${item.name}</td>
          <td style="font-family:Arial,sans-serif;font-size:13px;color:#FF6B9D;font-weight:600;padding:8px 0;border-bottom:1px solid #f0e8e0;text-align:right;">${item.price}</td>
        </tr>`).join('')}
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F0;border-radius:8px;margin:16px 0 18px;">
        <tr>
          <td style="padding:14px 18px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:Arial,sans-serif;font-size:13px;color:#5C3049;padding:3px 0;">Order total</td>
                <td style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#1A0A14;text-align:right;padding:3px 0;">€${totalAmount}</td>
              </tr>
              <tr>
                <td style="font-family:Arial,sans-serif;font-size:13px;color:#5C3049;padding:3px 0;">Ship to</td>
                <td style="font-family:Arial,sans-serif;font-size:13px;color:#1A0A14;font-weight:500;text-align:right;padding:3px 0;">${shippingName}, ${shippingCity}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="font-family:Arial,sans-serif;font-size:14px;color:#3D1A2C;line-height:1.7;margin:0 0 8px;">As soon as your package is on its way, we'll send you the tracking link so you can follow it every step of the way.</p>
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#5C3049;line-height:1.7;margin:0;font-style:italic;">Zodra je pakket onderweg is, sturen we je de trackinglink zodat je het kunt volgen.</p>
    </td>
  </tr>

  <tr>
    <td style="padding:24px 40px;text-align:center;border-bottom:1px solid #f0e8e0;">
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#5C3049;margin:0 0 12px;">Questions? We're always here for you.</p>
      <a href="mailto:hello@creativesolace.com" style="display:inline-block;background:#1A0A14;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:13px 32px;border-radius:100px;">hello@creativesolace.com</a>
    </td>
  </tr>
`);

const shippingNotificationEmail = (
  customerName: string,
  shippingName: string,
  shippingCity: string,
  trackingUrl: string
) => emailWrapper(`
  <tr>
    <td style="padding:32px 40px 24px;border-bottom:1px solid #f0e8e0;">
      <p style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#1A0A14;margin:0 0 4px;line-height:1.2;">Your order is on its way!</p>
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#5C3049;margin:0;font-style:italic;">Je bestelling is onderweg!</p>
    </td>
  </tr>

  <tr>
    <td style="padding:24px 40px;border-bottom:1px solid #f0e8e0;">
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#3D1A2C;line-height:1.7;margin:0 0 10px;">Hi <strong>${customerName}</strong>,</p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#3D1A2C;line-height:1.7;margin:0 0 10px;">Good news! Your rhinestone kit has left our studio and is now with PostNL. Time to clear a spot on the table.</p>
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#5C3049;line-height:1.7;margin:0 0 20px;font-style:italic;">Goed nieuws! Je rhinestone kit heeft ons studio verlaten en is onderweg via PostNL. Maak alvast ruimte op tafel.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F0;border-radius:8px;margin-bottom:4px;">
        <tr>
          <td style="padding:14px 18px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:Arial,sans-serif;font-size:13px;color:#5C3049;padding:3px 0;">Carrier</td>
                <td style="font-family:Arial,sans-serif;font-size:13px;color:#1A0A14;font-weight:500;text-align:right;padding:3px 0;">PostNL</td>
              </tr>
              <tr>
                <td style="font-family:Arial,sans-serif;font-size:13px;color:#5C3049;padding:3px 0;">Ship to</td>
                <td style="font-family:Arial,sans-serif;font-size:13px;color:#1A0A14;font-weight:500;text-align:right;padding:3px 0;">${shippingName}, ${shippingCity}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:24px 40px;text-align:center;border-bottom:1px solid #f0e8e0;">
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#5C3049;margin:0 0 6px;">Follow your package every step of the way.</p>
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#5C3049;font-style:italic;margin:0 0 14px;">Volg je pakket elke stap van de weg.</p>
      <a href="${trackingUrl}" style="display:inline-block;background:#1A0A14;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:13px 32px;border-radius:100px;">Track my order / Volg mijn pakket</a>
    </td>
  </tr>
`);

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const body = await request.text();

  try {
    const event = JSON.parse(body);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name;
      const amount = (session.amount_total / 100).toFixed(2);
      const shipping = session.shipping_details?.address || session.customer_details?.address;
      const shippingName = session.shipping_details?.name || customerName;
      const shippingCity = shipping?.city || '';

      const addressLine1 = shipping?.line1 || '';
      const streetMatch = addressLine1.match(/^(.*?)[\s]+(\d+\S*)$/);
      const shippingStreet = streetMatch ? streetMatch[1] : addressLine1;
      const shippingNumber = streetMatch ? streetMatch[2] : '';

      // Fetch line items from Stripe
      let lineItems: { name: string; price: string }[] = [];
      try {
        const liRes = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${session.id}/line_items?limit=25`,
          { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } }
        );
        const liData = await liRes.json() as any;
        lineItems = (liData?.data || []).map((item: any) => ({
          name: item.description || item.price?.nickname || 'Rhinestone Kit',
          price: `€${(item.amount_total / 100).toFixed(2)}`,
        }));
      } catch (liErr: any) {
        console.error('Line items fetch error:', liErr.message);
      }

      // Handle ticket purchases
      if (session.metadata?.isTicket === 'true') {
        const eventSlug = session.metadata?.eventSlug || '';
        const ticketCode = crypto.randomUUID().split('-')[0].toUpperCase();
        await env.DB.prepare(
          `INSERT INTO tickets (ticket_code, stripe_session_id, event_slug, customer_email, customer_name, amount, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, 'valid', datetime('now'))`
        ).bind(ticketCode, session.id, eventSlug, customerEmail, customerName, amount).run();

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketCode}`;
        await fetch('https://api.postmarkapp.com/email', {
          method: 'POST',
          headers: { 'X-Postmark-Server-Token': env.POSTMARK_TOKEN, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            From: `Creative Solace <${env.POSTMARK_FROM}>`,
            To: customerEmail,
            Subject: `Your ticket is confirmed! — Creative Solace`,
            HtmlBody: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;text-align:center;">
                <h2 style="color:#FF6B9D;">You're in!</h2>
                <p>Hi ${customerName},</p>
                <p>Your ticket for <strong>${eventSlug.replace(/-/g, ' ')}</strong> is confirmed. All materials are included!</p>
                <p style="font-size:32px;font-weight:900;letter-spacing:4px;color:#1A0A14;">${ticketCode}</p>
                <img src="${qrUrl}" alt="Your ticket QR code" style="margin:16px auto;display:block;"/>
                <p style="font-size:13px;color:#888;">Show this QR code or ticket code at the entrance.</p>
                <p>With sparkle,<br><strong>Creative Solace</strong></p>
              </div>
            `,
          }),
        });

        await fetch('https://api.postmarkapp.com/email', {
          method: 'POST',
          headers: { 'X-Postmark-Server-Token': env.POSTMARK_TOKEN, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            From: `Creative Solace <${env.POSTMARK_FROM}>`,
            To: env.POSTMARK_FROM,
            Subject: `New ticket — ${eventSlug} — ${customerName}`,
            HtmlBody: `
              <div style="font-family:Arial,sans-serif;">
                <h2>New Ticket Sale</h2>
                <p><strong>Event:</strong> ${eventSlug}</p>
                <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
                <p><strong>Amount:</strong> €${amount}</p>
                <p><strong>Ticket code:</strong> ${ticketCode}</p>
              </div>
            `,
          }),
        });

        return new Response('ok', { status: 200 });
      }

      // Save order to D1
      await env.DB.prepare(
        `INSERT INTO orders (
          stripe_session_id, customer_email, customer_name, amount, status,
          shipping_name, shipping_street, shipping_number, shipping_city,
          shipping_postal_code, shipping_country, created_at
        ) VALUES (?, ?, ?, ?, 'paid', ?, ?, ?, ?, ?, ?, datetime('now'))`
      ).bind(
        session.id, customerEmail, customerName, amount,
        shippingName, shippingStreet, shippingNumber,
        shipping?.city || '', shipping?.postal_code || '', shipping?.country || 'NL'
      ).run();

      // Create MyParcel shipment
      let myparcelShipmentId = null;
      try {
        const myparcelRes = await fetch('https://api.myparcel.nl/shipments', {
          method: 'POST',
          headers: {
            'Authorization': `basic ${btoa(env.MYPARCEL_API_KEY)}`,
            'Content-Type': 'application/vnd.shipment+json;charset=utf-8',
            'Accept': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            data: {
              shipments: [{
                carrier: 1,
                reference_identifier: session.id,
                recipient: {
                  cc: shipping?.country || 'NL',
                  city: shipping?.city || '',
                  postal_code: shipping?.postal_code || '',
                  street: shippingStreet,
                  number: shippingNumber,
                  person: shippingName,
                  email: customerEmail,
                },
                options: { package_type: 1 },
              }],
            },
          }),
        });

        const myparcelData = await myparcelRes.json() as any;
        myparcelShipmentId = myparcelData?.data?.ids?.[0]?.id || null;

        if (myparcelShipmentId) {
          await env.DB.prepare(
            `UPDATE orders SET myparcel_shipment_id = ? WHERE stripe_session_id = ?`
          ).bind(String(myparcelShipmentId), session.id).run();
        }
      } catch (mpErr: any) {
        console.error('MyParcel error:', mpErr.message);
      }

      // Send branded order confirmation to customer
      await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: { 'X-Postmark-Server-Token': env.POSTMARK_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          From: `Creative Solace <${env.POSTMARK_FROM}>`,
          To: customerEmail,
          Subject: `Your order is confirmed! — Creative Solace`,
          HtmlBody: orderConfirmationEmail(customerName, lineItems, amount, shippingName, shippingCity),
        }),
      });

      // Notify Nikki
      await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: { 'X-Postmark-Server-Token': env.POSTMARK_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          From: `Creative Solace <${env.POSTMARK_FROM}>`,
          To: env.POSTMARK_FROM,
          Subject: `New order — €${amount} — ${customerName}`,
          HtmlBody: `
            <div style="font-family:Arial,sans-serif;">
              <h2>New Order</h2>
              <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
              <p><strong>Amount:</strong> €${amount}</p>
              <p><strong>Ship to:</strong> ${shippingName}, ${addressLine1}, ${shipping?.postal_code} ${shippingCity}, ${shipping?.country}</p>
              <p><strong>MyParcel shipment ID:</strong> ${myparcelShipmentId || 'not created — create manually in MyParcel dashboard'}</p>
              <p><strong>Session ID:</strong> ${session.id}</p>
            </div>
          `,
        }),
      });
    }

    return new Response('ok', { status: 200 });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};
