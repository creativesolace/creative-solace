import type { APIContext } from 'astro';

export const prerender = false;

const PASSWORD = 'igurE-jkc23-TIy?!';
const R2_PUBLIC_URL = 'https://pub-6faae82249d24e62b02dd40b5cc74d40.r2.dev';

export async function POST({ request, locals }: APIContext) {
  const url = new URL(request.url);
  if (url.searchParams.get('password') !== PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const env = (locals as any).runtime?.env;
  const materialId = url.searchParams.get('materialId') || 'unknown';
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) return new Response(JSON.stringify({ error: 'No file' }), { status: 400 });
  const ext = file.name.split('.').pop();
  const key = `materials/${materialId}.${ext}`;
  await env.R2_ASSETS.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
  return new Response(JSON.stringify({ url: `${R2_PUBLIC_URL}/${key}` }), { status: 200 });
}
