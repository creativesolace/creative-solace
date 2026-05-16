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

    const pmRes = await fetch('https://api.postmarkapp.com/email', {
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
    console.log('Postmark response:', await pmRes.text());

    const tokenRes = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: env.ZOHO_REFRESH_TOKEN,
        client_id: env.ZOHO_CLIENT_ID,
        client_secret: env.ZOHO_CLIENT_SECRET,
      }),
    });
    const tokenData = await tokenRes.json() as any;
    console.log('Zoho token:', JSON.stringify(tokenData));
    const access_token = tokenData.access_token;

    const orgId = '20114664605';

    const contactRes = await fetch('https://desk.zoho.eu/api/v1/contacts/search?email=' + encodeURIComponent(email), {
      headers: { 'Authorization': `Zoho-oauthtoken ${access_token}`, 'orgId': orgId },
    });
    const contactData = await contactRes.json() as any;
    console.log('Zoho contact search:', JSON.stringify(contactData));

    let contactId: string;
    if (contactData?.data?.length > 0) {
      contactId = contactData.data[0].id;
    } else {
      const newContact = await fetch('https://desk.zoho.eu/api/v1/contacts', {
        method: 'POST',
        headers: { 'Authorization': `Zoho-oauthtoken ${access_token}`, 'orgId': orgId, 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastName: name, email }),
      });
      const newContactData = await newContact.json() as any;
      console.log('Zoho new contact:', JSON.stringify(newContactData));
      contactId = newContactData.id;
    }

    const ticketRes = await fetch('https://desk.zoho.eu/api/v1/tickets', {
      method: 'POST',
      headers: { 'Authorization': `Zoho-oauthtoken ${access_token}`, 'orgId': orgId, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: `New booking: ${workshopType} — ${name}`,
        description: `Name: ${name}\nEmail: ${email}\nWorkshop: ${workshopType}\nDate: ${resolvedDate || 'Flexible'}\nGuests: ${guests || 'TBC'}\nMessage: ${message || '—'}`,
        contactId,
        channel: 'Web',
      }),
    });
    console.log('Zoho ticket:', await ticketRes.text());

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error('Booking error:', err.message, err.stack);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
