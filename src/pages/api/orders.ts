import type { APIContext } from 'astro';

export const prerender = false;

export async function GET({ request, locals }: APIContext) {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  if (password !== locals.runtime.env.CHECKIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const db = locals.runtime.env.DB;
  const { results } = await db.prepare(
    `SELECT id, created_at, customer_name, customer_email, amount, shipping_street, shipping_number, shipping_city, shipping_postal_code, shipping_country, myparcel_shipment_id, fulfillment_status, tracking_url FROM orders ORDER BY created_at DESC`
  ).all();
  return new Response(JSON.stringify(results), { status: 200 });
}

export async function PATCH({ request, locals }: APIContext) {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  if (password !== locals.runtime.env.CHECKIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { id, fulfillment_status } = await request.json();
  const allowed = ['paid', 'picked_and_packed', 'label_printed', 'dropped_off', 'shipped', 'delivered'];
  if (!allowed.includes(fulfillment_status)) {
    return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 });
  }
  const db = locals.runtime.env.DB;
  await db.prepare(`UPDATE orders SET fulfillment_status = ? WHERE id = ?`).bind(fulfillment_status, id).run();
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
