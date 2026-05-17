import type { APIContext } from 'astro';

export const prerender = false;

const PASSWORD = 'igurE-jkc23-TIy?!';

export async function GET({ request, locals }: APIContext) {
  const url = new URL(request.url);
  if (url.searchParams.get('password') !== PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const db = locals.runtime.env.DB;

  const { results: orders } = await db.prepare(
    `SELECT customer_email as email, customer_name as name, COUNT(*) as order_count,
     SUM(CAST(amount as REAL)) as kit_spend, MAX(created_at) as last_order
     FROM orders GROUP BY customer_email`
  ).all();

  const { results: tickets } = await db.prepare(
    `SELECT customer_email as email, customer_name as name, COUNT(*) as ticket_count,
     SUM(CAST(amount as REAL)) as ticket_spend, MAX(created_at) as last_ticket,
     GROUP_CONCAT(DISTINCT event_slug) as events
     FROM tickets GROUP BY customer_email`
  ).all();

  const map: Record<string, any> = {};

  for (const o of orders) {
    const email = (o.email as string || '').toLowerCase();
    if (!map[email]) map[email] = { email, name: o.name, types: [], kit_spend: 0, ticket_spend: 0, order_count: 0, ticket_count: 0, events: [], last_activity: null };
    map[email].order_count = o.order_count;
    map[email].kit_spend = o.kit_spend || 0;
    map[email].last_activity = o.last_order;
    if (!map[email].types.includes('kit')) map[email].types.push('kit');
  }

  for (const t of tickets) {
    const email = (t.email as string || '').toLowerCase();
    if (!map[email]) map[email] = { email, name: t.name, types: [], kit_spend: 0, ticket_spend: 0, order_count: 0, ticket_count: 0, events: [], last_activity: null };
    map[email].ticket_count = t.ticket_count;
    map[email].ticket_spend = t.ticket_spend || 0;
    map[email].events = t.events ? (t.events as string).split(',') : [];
    if (!map[email].last_activity || t.last_ticket > map[email].last_activity) map[email].last_activity = t.last_ticket;
    if (!map[email].types.includes('ticket')) map[email].types.push('ticket');
  }

  const customers = Object.values(map).sort((a: any, b: any) =>
    (b.kit_spend + b.ticket_spend) - (a.kit_spend + a.ticket_spend)
  );

  return new Response(JSON.stringify(customers), { status: 200 });
}
