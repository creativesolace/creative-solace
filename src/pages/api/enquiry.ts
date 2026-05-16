export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;

  try {
    const body = await request.json();
    const { firstName, lastName, name: fullName, email, eventType, enquiryType, preferredDate, date, guests, message } = body;

    const resolvedEventType = eventType || enquiryType;

    if (!email || !resolvedEventType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const name = fullName || `${firstName || ''} ${lastName || ''}`.trim() || 'Customer';
    const resolvedDate = date || preferredDate || null;

    await env.DB.prepare(
      `INSERT INTO enquiries (name, email, event_type, preferred_date, guests, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'new', datetime('now'))`
    ).bind(name, email, resolvedEventType, resolvedDate, guests || null, message || null).run();

    await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: { 'X-Postmark-Server-Token': env.POSTMARK_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        From: `Creative Solace <${env.POSTMARK_FROM}>`,
        To: email,
        Subject: `✨ We received your enquiry!`,
        HtmlBody: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6B9D;">Thanks ${name}! ✨</h2>
            <p>We've received your enquiry for <strong>${resolvedEventType}</strong>.</p>
            <p>We'll review your request and get back to you within 24 hours with a custom quote. ☀️</p>
            <p>Warm regards,<br><strong>Creative Solace</strong></p>
          </div>
        `,
      }),
    });

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
    const access_token = tokenData.access_token;

    const orgId = '20114664605';

    const contactRes = await fetch('https://desk.zoho.eu/api/v1/contacts/search?email=' + encodeURIComponent(email), {
      headers: { 'Authorization': `Zoho-oauthtoken ${access_token}`, 'orgId': orgId },
    });
    const contactData = await contactRes.json() as any;

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
      contactId = newContactData.id;
    }

    await fetch('https://desk.zoho.eu/api/v1/tickets', {
      method: 'POST',
      headers: { 'Authorization': `Zoho-oauthtoken ${access_token}`, 'orgId': orgId, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: `New enquiry: ${resolvedEventType} — ${name}`,
        description: `Name: ${name}\nEmail: ${email}\nEvent Type: ${resolvedEventType}\nDate: ${resolvedDate || 'Flexible'}\nGuests: ${guests || 'TBC'}\nMessage: ${message || '—'}`,
        contactId,
        departmentId: '237675000000007061',
        channel: 'Web',
      }),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error('Enquiry error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
