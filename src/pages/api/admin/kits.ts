import type { APIContext } from 'astro';

export const prerender = false;

const PASSWORD = 'igurE-jkc23-TIy?!';

function unauth() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}

export async function GET({ request, locals }: APIContext) {
  const url = new URL(request.url);
  if (url.searchParams.get('password') !== PASSWORD) return unauth();
  const db = locals.runtime.env.DB;
  const { results } = await db.prepare(
    `SELECT kc.id, kc.kit_slug, kc.quantity_needed, m.id as material_id, m.name, m.category, m.purchase_price, m.unit, m.quantity_in_stock
     FROM kit_components kc JOIN materials m ON kc.material_id = m.id
     ORDER BY kc.kit_slug, m.category, m.name`
  ).all();
  return new Response(JSON.stringify(results), { status: 200 });
}

export async function POST({ request, locals }: APIContext) {
  const url = new URL(request.url);
  if (url.searchParams.get('password') !== PASSWORD) return unauth();
  const db = locals.runtime.env.DB;
  const { kit_slug, material_id, quantity_needed } = await request.json();
  if (!kit_slug || !material_id) return new Response(JSON.stringify({ error: 'kit_slug and material_id required' }), { status: 400 });
  const result = await db.prepare(
    `INSERT INTO kit_components (kit_slug, material_id, quantity_needed) VALUES (?, ?, ?)`
  ).bind(kit_slug, material_id, quantity_needed || 1).run();
  return new Response(JSON.stringify({ ok: true, id: result.meta.last_row_id }), { status: 201 });
}

export async function DELETE({ request, locals }: APIContext) {
  const url = new URL(request.url);
  if (url.searchParams.get('password') !== PASSWORD) return unauth();
  const db = locals.runtime.env.DB;
  const { id } = await request.json();
  if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
  await db.prepare(`DELETE FROM kit_components WHERE id = ?`).bind(id).run();
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
