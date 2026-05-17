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
    `SELECT * FROM materials ORDER BY category, name`
  ).all();
  return new Response(JSON.stringify(results), { status: 200 });
}

export async function POST({ request, locals }: APIContext) {
  const url = new URL(request.url);
  if (url.searchParams.get('password') !== PASSWORD) return unauth();
  const db = locals.runtime.env.DB;
  const b = await request.json();
  const { name, category, description, supplier_name, purchase_price, vat_percent, quantity_in_stock, unit, weight_grams, width_cm, height_cm, colors, photo_url } = b;
  if (!name || !category) return new Response(JSON.stringify({ error: 'name and category required' }), { status: 400 });
  const result = await db.prepare(
    `INSERT INTO materials (name, category, description, supplier_name, purchase_price, vat_percent, quantity_in_stock, unit, weight_grams, width_cm, height_cm, colors, photo_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(name, category, description||null, supplier_name||null, purchase_price||0, vat_percent||21, quantity_in_stock||0, unit||'pieces', weight_grams||null, width_cm||null, height_cm||null, colors||null, photo_url||null).run();
  const row = await db.prepare(`SELECT * FROM materials WHERE id = ?`).bind(result.meta.last_row_id).first();
  return new Response(JSON.stringify(row), { status: 201 });
}

export async function PATCH({ request, locals }: APIContext) {
  const url = new URL(request.url);
  if (url.searchParams.get('password') !== PASSWORD) return unauth();
  const db = locals.runtime.env.DB;
  const b = await request.json();
  const { id, ...fields } = b;
  if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
  const allowed = ['name','category','description','supplier_name','purchase_price','vat_percent','quantity_in_stock','unit','weight_grams','width_cm','height_cm','colors','photo_url'];
  const keys = Object.keys(fields).filter(k => allowed.includes(k));
  if (!keys.length) return new Response(JSON.stringify({ error: 'No valid fields' }), { status: 400 });
  const sets = keys.map(k => k + ' = ?').join(', ');
  const vals = keys.map(k => fields[k]);
  await db.prepare(`UPDATE materials SET ${sets} WHERE id = ?`).bind(...vals, id).run();
  const row = await db.prepare(`SELECT * FROM materials WHERE id = ?`).bind(id).first();
  return new Response(JSON.stringify(row), { status: 200 });
}

export async function DELETE({ request, locals }: APIContext) {
  const url = new URL(request.url);
  if (url.searchParams.get('password') !== PASSWORD) return unauth();
  const db = locals.runtime.env.DB;
  const { id } = await request.json();
  if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
  const refs = await db.prepare(`SELECT COUNT(*) as n FROM kit_components WHERE material_id = ?`).bind(id).first();
  if (refs && refs.n > 0) return new Response(JSON.stringify({ error: 'Material is used in kit components — remove from kits first' }), { status: 409 });
  await db.prepare(`DELETE FROM materials WHERE id = ?`).bind(id).run();
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
