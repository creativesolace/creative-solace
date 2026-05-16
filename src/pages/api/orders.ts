import type { APIContext } from 'astro';

export const prerender = false;

const PASSWORD = 'igurE-jkc23-TIy?!';

export async function GET({ request, locals }: APIContext) {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  if (password !== PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const showArchived = url.searchParams.get('archived') === '1';
  const db = locals.runtime.env.DB;
  const { results } = await db.prepare(
    `SELECT id, created_at, customer_name, customer_email, amount, shipping_street, shipping_number, shipping_city, shipping_postal_code, shipping_country, myparcel_shipment_id, fulfillment_status, tracking_url, archived FROM orders WHERE archived = ? ORDER BY created_at DESC`
  ).bind(showArchived ? 1 : 0).all();
  return new Response(JSON.stringify(results), { status: 200 });
}

export async function PATCH({ request, locals }: APIContext) {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  if (password !== PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const body = await request.json();
  const db = locals.runtime.env.DB;
  if (body.action === 'archive') {
    const ids = body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: 'No ids' }), { status: 400 });
    }
    const placeholders = ids.map(() => '?').join(',');
    await db.prepare(`UPDATE orders SET archived = 1 WHERE id IN (${placeholders})`).bind(...ids).run();
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  if (body.action === 'unarchive') {
    const ids = body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: 'No ids' }), { status: 400 });
    }
    const placeholders = ids.map(() => '?').join(',');
    await db.prepare(`UPDATE orders SET archived = 0 WHERE id IN (${placeholders})`).bind(...ids).run();
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  const { id, fulfillment_status } = body;
  const allowed = ['paid', 'picked_and_packed', 'label_printed', 'dropped_off', 'shipped', 'delivered'];
  if (!allowed.includes(fulfillment_status)) {
    return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 });
  }
  await db.prepare(`UPDATE orders SET fulfillment_status = ? WHERE id = ?`).bind(fulfillment_status, id).run();
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
