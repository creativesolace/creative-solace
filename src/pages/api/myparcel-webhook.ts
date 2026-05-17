import type { APIContext } from "astro";

export const prerender = false;

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

export async function POST({ request, locals }: APIContext) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const env = locals.runtime.env;
  const db = env.DB;
  const data = body?.data?.hooks?.[0];
  if (!data) return new Response("ok", { status: 200 });

  const shipmentId = String(data.shipment_id);
  const status = data.status;
  const trackingUrl = data.barcode
    ? "https://tracktrace.postnl.nl/parcels/nl/nl/" + data.barcode
    : null;

  if (status === 7) {
    await db.prepare(
      "UPDATE orders SET fulfillment_status = 'shipped' WHERE myparcel_shipment_id = ?"
    ).bind(shipmentId).run();

    if (trackingUrl) {
      await db.prepare(
        "UPDATE orders SET tracking_url = ? WHERE myparcel_shipment_id = ?"
      ).bind(trackingUrl, shipmentId).run();

      // Fetch order details for the email
      const order = await db.prepare(
        "SELECT customer_email, customer_name, shipping_name, shipping_city FROM orders WHERE myparcel_shipment_id = ?"
      ).bind(shipmentId).first() as any;

      if (order?.customer_email) {
        await fetch('https://api.postmarkapp.com/email', {
          method: 'POST',
          headers: {
            'X-Postmark-Server-Token': env.POSTMARK_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            From: `Creative Solace <${env.POSTMARK_FROM}>`,
            To: order.customer_email,
            Subject: `Your order is on its way! — Creative Solace`,
            HtmlBody: shippingNotificationEmail(
              order.customer_name,
              order.shipping_name,
              order.shipping_city,
              trackingUrl
            ),
          }),
        });
      }
    }
  } else if (status === 11) {
    await db.prepare(
      "UPDATE orders SET fulfillment_status = 'delivered' WHERE myparcel_shipment_id = ?"
    ).bind(shipmentId).run();
  }

  return new Response("ok", { status: 200 });
}
