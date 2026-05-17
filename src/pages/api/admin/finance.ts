import type { APIContext } from 'astro';

export const prerender = false;

const PASSWORD = 'igurE-jkc23-TIy?!';

async function getZohoToken(env: any) {
  const res = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: env.ZOHO_CLIENT_ID,
      client_secret: env.ZOHO_CLIENT_SECRET,
      refresh_token: env.ZOHO_REFRESH_TOKEN,
    }),
  });
  const data = await res.json() as any;
  return data.access_token as string;
}

export async function GET({ request, locals }: APIContext) {
  const url = new URL(request.url);
  if (url.searchParams.get('password') !== PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const env = (locals as any).runtime?.env;

  const from = url.searchParams.get('from') || new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10);
  const to = url.searchParams.get('to') || new Date().toISOString().slice(0, 10);

  // Stripe — payment intents
  let stripeData: any[] = [];
  try {
    const fromTs = Math.floor(new Date(from).getTime() / 1000);
    const toTs = Math.floor(new Date(to + 'T23:59:59').getTime() / 1000);
    const stripeRes = await fetch(
      `https://api.stripe.com/v1/payment_intents?created[gte]=${fromTs}&created[lte]=${toTs}&limit=100`,
      { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } }
    );
    const stripeJson = await stripeRes.json() as any;
    stripeData = (stripeJson.data || []).filter((p: any) => p.status === 'succeeded');
  } catch (e) {}

  // Zoho Invoice
  let zohoInvoices: any[] = [];
  try {
    const token = await getZohoToken(env);
    const zohoRes = await fetch(
      `https://invoice.zoho.eu/api/v3/invoices?date_start=${from}&date_end=${to}&per_page=200`,
      { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
    );
    const zohoJson = await zohoRes.json() as any;
    zohoInvoices = zohoJson.invoices || [];
  } catch (e) {}

  const b2cTotal = stripeData.reduce((s: number, p: any) => s + (p.amount || 0), 0);
  const b2bTotal = zohoInvoices.reduce((s: number, inv: any) => s + Math.round((parseFloat(inv.total) || 0) * 100), 0);
  const vatB2C = Math.round(b2cTotal / 1.21 * 0.21);
  const outstanding = zohoInvoices.filter((inv: any) => ['sent','overdue'].includes(inv.status));

  return new Response(JSON.stringify({
    from, to,
    b2cTotal, b2bTotal,
    vatB2C,
    outstandingCount: outstanding.length,
    outstandingTotal: outstanding.reduce((s: number, inv: any) => s + Math.round((parseFloat(inv.total) || 0) * 100), 0),
    stripePayments: stripeData.map((p: any) => ({
      id: p.id,
      date: new Date(p.created * 1000).toISOString().slice(0, 10),
      amount: p.amount,
      currency: p.currency,
      description: p.description || '',
      customer: p.receipt_email || '',
    })),
    zohoInvoices: zohoInvoices.map((inv: any) => {
      const total = Math.round((parseFloat(inv.total) || 0) * 100);
      const subtotal = Math.round((parseFloat(inv.sub_total) || 0) * 100);
      const tax_total = Math.round((parseFloat(inv.tax_total) || 0) * 100);
      // Zoho list endpoint sometimes omits tax_total/sub_total — derive from total if missing
      const derivedSubtotal = subtotal || Math.round(total / 1.21);
      const derivedTax = tax_total || (total - derivedSubtotal);
      return {
        number: inv.invoice_number,
        client: inv.customer_name,
        date: inv.date,
        total,
        tax_total: derivedTax,
        subtotal: derivedSubtotal,
        status: inv.status,
      };
    }),
  }), { status: 200 });
}
