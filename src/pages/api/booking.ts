export const prerender = false;

import type { APIRoute } from 'astro';
import { createZohoTicket } from './zoho';

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

    await createZohoTicket(env, {
      name,
      email,
      subject: `New booking: ${workshopType} — ${name}`,
      description: `Name: ${name}\nEmail: ${email}\nWorkshop: ${workshopType}\nDate: ${resolvedDate || 'Flexible'}\nGuests: ${guests || 'TBC'}\nMessage: ${message || '—'}`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error('Booking error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
