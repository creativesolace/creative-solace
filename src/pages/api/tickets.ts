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
    `SELECT id, ticket_code, event_slug, customer_email, customer_name, amount, status, checked_in_at, created_at FROM tickets ORDER BY event_slug, created_at DESC`
  ).all();
  return new Response(JSON.stringify(results), { status: 200 });
}
