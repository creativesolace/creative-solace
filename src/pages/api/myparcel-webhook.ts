import type { APIContext } from "astro";

export const prerender = false;

export async function POST({ request, locals }: APIContext) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const db = locals.runtime.env.DB;
  const data = body?.data?.hooks?.[0];
  if (!data) return new Response("ok", { status: 200 });

  const shipmentId = String(data.shipment_id);
  const status = data.status;
  const trackingUrl = data.barcode
    ? "https://tracktrace.postnl.nl/parcels/nl/nl/" + data.barcode
    : null;

  if (status === 7) {
    await db.prepare(
      "UPDATE orders SET fulfillment_status = 'shipped' WHERE myparcel_shipment_id = ?"
    ).bind(shipmentId).run();
    if (trackingUrl) {
      await db.prepare(
        "UPDATE orders SET tracking_url = ? WHERE myparcel_shipment_id = ?"
      ).bind(trackingUrl, shipmentId).run();
    }
  } else if (status === 11) {
    await db.prepare(
      "UPDATE orders SET fulfillment_status = 'delivered' WHERE myparcel_shipment_id = ?"
    ).bind(shipmentId).run();
  }

  return new Response("ok", { status: 200 });
}
