export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;

  try {
    const { code } = await request.json();

    if (!code) {
      return new Response(JSON.stringify({ status: 'invalid' }), { status: 200 });
    }

    const ticket = await env.DB.prepare(
      `SELECT * FROM tickets WHERE ticket_code = ?`
    ).bind(code.trim().toUpperCase()).first();

    if (!ticket) {
      return new Response(JSON.stringify({ status: 'invalid' }), { status: 200 });
    }

    if (ticket.status === 'used') {
      return new Response(JSON.stringify({
        status: 'already_used',
        name: ticket.customer_name,
        event: ticket.event_slug,
        checked_in_at: ticket.checked_in_at,
      }), { status: 200 });
    }

    // Mark as used
    await env.DB.prepare(
      `UPDATE tickets SET status = 'used', checked_in_at = datetime('now') WHERE ticket_code = ?`
    ).bind(code.trim().toUpperCase()).run();

    return new Response(JSON.stringify({
      status: 'valid',
      name: ticket.customer_name,
      event: ticket.event_slug,
    }), { status: 200 });

  } catch (err: any) {
    console.error('Checkin error:', err);
    return new Response(JSON.stringify({ status: 'invalid' }), { status: 200 });
  }
};
