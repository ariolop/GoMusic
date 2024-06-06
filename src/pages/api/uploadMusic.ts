import { put } from "@vercel/blob";
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
  const form = await context.request.formData();
  const file = form.get('file') as File;

  const { url } = await put("audios/" + file.name, file, { access: 'public' });

  return new Response(url, {status: 404})
}
