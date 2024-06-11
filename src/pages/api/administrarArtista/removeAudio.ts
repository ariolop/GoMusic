import { del } from "@vercel/blob";
import type { APIContext } from "astro";
import { db, Audios, eq, Album_Audio } from "astro:db";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData()
    const idAudio = formData.get("idAudio").toString()

    //Obtenemos la ruta del audio y de la portada para posteriormente borrarlo del Blob
    const { rutaSonido, rutaImagen } = (await db.select({rutaSonido: Audios.rutaSonido, rutaImagen: Audios.rutaImagen}).from(Audios).where(eq(Audios.idAudio, idAudio)))[0];
    console.log(rutaSonido);
    del(rutaSonido)
    console.log(rutaImagen);
    del(rutaImagen)
    
    //Borramos los registros de la BD
    await db.delete(Album_Audio).where(eq(Album_Audio.idAudio, idAudio));
    await db.delete(Audios).where(eq(Audios.idAudio, idAudio));
    
    
    return new Response('Audio borrado', {status: 200})
}
