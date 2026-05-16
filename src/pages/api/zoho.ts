export async function createZohoTicket(env: any, { name, email, subject, description }: {
  name: string;
  email: string;
  subject: string;
  description: string;
}) {
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
  const { access_token } = await tokenRes.json() as any;

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
      headers: {
        'Authorization': `Zoho-oauthtoken ${access_token}`,
        'orgId': orgId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lastName: name, email }),
    });
    const newContactData = await newContact.json() as any;
    contactId = newContactData.id;
  }

  await fetch('https://desk.zoho.eu/api/v1/tickets', {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${access_token}`,
      'orgId': orgId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject,
      description,
      contactId,
      channel: 'Web',
    }),
  });
}
