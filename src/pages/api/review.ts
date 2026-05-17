import type { APIContext } from 'astro';

export const prerender = false;

const PASSWORD = 'igurE-jkc23-TIy?!';

export async function GET({ request, locals }: APIContext) {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  if (password !== PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const status = url.searchParams.get('status') || 'pending';
  const db = locals.runtime.env.DB;
  const { results } = await db.prepare(
    `SELECT id, name, city, product, rating, text, status, created_at FROM reviews WHERE status = ? ORDER BY created_at DESC`
  ).bind(status).all();
  return new Response(JSON.stringify(results), { status: 200 });
}

export async function POST({ request, locals }: APIContext) {
  const env = (locals as any).runtime?.env;
  try {
    const body = await request.json();
    const { name, city, product, rating, text } = body;
    if (!name || !text) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    await env.DB.prepare(
      `INSERT INTO reviews (name, city, product, rating, text, status, created_at) VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'))`
    ).bind(name, city || null, product || null, rating || null, text).run();

    await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: { 'X-Postmark-Server-Token': env.POSTMARK_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        From: `Creative Solace <${env.POSTMARK_FROM}>`,
        To: env.POSTMARK_FROM,
        Subject: `⭐ New review pending approval — ${name}`,
        HtmlBody: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6B9D;">New review submitted ⭐</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>City:</strong> ${city || '—'}</p>
            <p><strong>Product:</strong> ${product || '—'}</p>
            <p><strong>Rating:</strong> ${'⭐'.repeat(rating || 0)}</p>
            <p><strong>Review:</strong></p>
            <blockquote style="border-left: 3px solid #FF6B9D; padding-left: 12px; color: #555;">${text}</blockquote>
            <p><a href="https://creativesolace.com/orders" style="background: #FF6B9D; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Review in admin panel</a></p>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

export async function PATCH({ request, locals }: APIContext) {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  if (password !== PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const env = (locals as any).runtime?.env;
  const body = await request.json();
  const { id, action } = body;
  if (!id || !['approve', 'reject'].includes(action)) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }
  const status = action === 'approve' ? 'approved' : 'rejected';
  await env.DB.prepare(`UPDATE reviews SET status = ? WHERE id = ?`).bind(status, id).run();
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
