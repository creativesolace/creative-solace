export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;

  try {
    const body = await request.json();
    const { firstName, lastName, email, eventType, date, guests, message } = body;

    if (!email || !firstName || !eventType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const name = `${firstName} ${lastName}`.trim();

    await env.DB.prepare(
      `INSERT INTO enquiries (name, email, event_type, preferred_date, guests, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'new', datetime('now'))`
    ).bind(name, email, eventType, date || null, guests || null, message || null).run();

    await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': env.POSTMARK_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        From: `Creative Solace <${env.POSTMARK_FROM}>`,
        To: email,
        Subject: `✨ We received your enquiry!`,
        HtmlBody: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6B9D;">Thanks ${firstName}! ✨</h2>
            <p>We've received your enquiry for <strong>${eventType}</strong>.</p>
            <p>We'll review your request and get back to you within 24 hours with a custom quote. ☀️</p>
            <p>Warm regards,<br><strong>Creative Solace</strong></p>
          </div>
        `,
      }),
    });

    await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': env.POSTMARK_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        From: `Creative Solace <${env.POSTMARK_FROM}>`,
        To: env.POSTMARK_FROM,
        Subject: `💼 New enquiry: ${eventType} — ${name}`,
        HtmlBody: `
          <div style="font-family: sans-serif;">
            <h2>New Enquiry 💼</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #eee;">${email}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Event Type</strong></td><td style="padding: 8px; border: 1px solid #eee;">${eventType}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Date</strong></td><td style="padding: 8px; border: 1px solid #eee;">${date || 'Flexible'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Guests</strong></td><td style="padding: 8px; border: 1px solid #eee;">${guests || 'TBC'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #eee;">${message || '—'}</td></tr>
            </table>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error('Enquiry error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
