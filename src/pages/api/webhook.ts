export const prerender = false;

import type { APIRoute } from 'astro';

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

      // Parse street + house number from address line1
      // MyParcel requires them split — e.g. "Kalverstraat 15" -> street: "Kalverstraat", number: "15"
      const addressLine1 = shipping?.line1 || '';
      const streetMatch = addressLine1.match(/^(.*?)[\s]+(\d+\S*)$/);
      const shippingStreet = streetMatch ? streetMatch[1] : addressLine1;
      const shippingNumber = streetMatch ? streetMatch[2] : '';

      // Save order to D1 with shipping details
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
              shipments: [
                {
                  carrier: 1, // PostNL
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
                  options: {
                    package_type: 1, // Parcel
                  },
                },
              ],
            },
          }),
        });

        const myparcelData = await myparcelRes.json() as any;
        console.log('MyParcel key present:', !!env.MYPARCEL_API_KEY);
        console.log('MyParcel key length:', env.MYPARCEL_API_KEY?.length);
        console.log('MyParcel status:', myparcelRes.status);
        console.log('MyParcel response:', JSON.stringify(myparcelData));
        myparcelShipmentId = myparcelData?.data?.ids?.[0]?.id || null;

        if (myparcelShipmentId) {
          await env.DB.prepare(
            `UPDATE orders SET myparcel_shipment_id = ? WHERE stripe_session_id = ?`
          ).bind(String(myparcelShipmentId), session.id).run();
        }
      } catch (mpErr: any) {
        console.error('MyParcel error:', mpErr.message);
        // Don't fail the webhook — order is saved, label can be created manually
      }

      // Send order confirmation to customer
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

      // Notify Nikki
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
              <p><strong>Ship to:</strong> ${shippingName}, ${addressLine1}, ${shipping?.postal_code} ${shipping?.city}, ${shipping?.country}</p>
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
