export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;

  try {
    const body = await request.json();
    const { firstName, lastName, name: fullName, email, workshopType, preferredDate, date, guests, message } = body;

    if (!email || !workshopType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const name = fullName || `${firstName || ''} ${lastName || ''}`.trim() || 'Customer';
    const resolvedDate = preferredDate || date || null;

    await env.DB.prepare(
      `INSERT INTO bookings (name, email, workshop_type, preferred_date, guests, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', datetime('now'))`
    ).bind(name, email, workshopType, resolvedDate, guests || null, message || null).run();

    await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: { 'X-Postmark-Server-Token': env.POSTMARK_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        From: `Creative Solace <${env.POSTMARK_FROM}>`,
        To: email,
        Subject: `✨ Booking request received — ${workshopType}`,
        HtmlBody: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6B9D;">Hi ${name}! ✨</h2>
            <p>We've received your booking request for <strong>${workshopType}</strong>.</p>
            <ul>
              <li><strong>Date:</strong> ${resolvedDate || 'Flexible'}</li>
              <li><strong>Guests:</strong> ${guests || 'TBC'}</li>
              <li><strong>Message:</strong> ${message || '—'}</li>
            </ul>
            <p>We'll get back to you within 24 hours to confirm everything. 💌</p>
            <p>Can't wait to sparkle with you!<br><strong>Creative Solace</strong></p>
          </div>
        `,
      }),
    });

    await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: { 'X-Postmark-Server-Token': env.POSTMARK_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        From: `Creative Solace <${env.POSTMARK_FROM}>`,
        To: `${env.POSTMARK_FROM}, support@creativesolace.zohodesk.eu`,
        Subject: `🎨 New booking: ${workshopType} — ${name}`,
        HtmlBody: `
          <div style="font-family: sans-serif;">
            <h2>New Workshop Booking 🎨</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #eee;">${email}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Workshop</strong></td><td style="padding: 8px; border: 1px solid #eee;">${workshopType}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Date</strong></td><td style="padding: 8px; border: 1px solid #eee;">${resolvedDate || 'Flexible'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Guests</strong></td><td style="padding: 8px; border: 1px solid #eee;">${guests || 'TBC'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #eee;">${message || '—'}</td></tr>
            </table>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error('Booking error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
