import { put } from "@vercel/blob";
import type { APIContext } from "astro";
import { log } from "console";

export async function POST(context: APIContext): Promise<Response> {
  //const formData = await context.request.formData();
  const blob = await context.request.blob()
  const file = new File([blob], "ejemplo.mp3");

  const { url } = await put(file.name, 'Hello World!', { access: 'public' });

  return new Response(url, {status: 404})
  //const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });
}
