import { del } from "@vercel/blob";
import type { APIContext } from "astro";
import { db, Audios, eq, Album_Audio } from "astro:db";
import { generateId } from "lucia";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData()
    const idAudio = formData.get("idAudio").toString()

    //Obtenemos la ruta del audio para posteriormente borrarlo del Blob
    const rutaSonido = (await db.select({rutaSonido: Audios.rutaSonido}).from(Audios).where(eq(Audios.idAudio, idAudio)))[0].rutaSonido;
    console.log(rutaSonido);
    del(rutaSonido)
    
    //Borramos los registros de la BD
    await db.delete(Album_Audio).where(eq(Album_Audio.idAudio, idAudio));
    await db.delete(Audios).where(eq(Audios.idAudio, idAudio));
    
    
    return new Response('Audio borrado', {status: 200})
}
