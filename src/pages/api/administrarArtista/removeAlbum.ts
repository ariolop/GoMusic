import { del } from "@vercel/blob";
import type { APIContext } from "astro";
import { db, Audios, eq, Album_Audio, inArray, Album } from "astro:db";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData()
    const idAlbum = formData.get("idAlbum").toString()

    //Obtenemos todos los idAudio que contenga el album
    const idsAudioConsulta = await db.select({idAudio: Audios.idAudio}).from(Album_Audio).where(eq(Album_Audio.idAlbum, idAlbum))
    
    if (idsAudioConsulta.length > 0)
    {
        //Obtenemos los idsAudio del album
        const idsAudio = idsAudioConsulta.map((row) => row.idAudio)
        console.log(idsAudio);
    
        //Obtenemos las rutas de los audios y de las portadas para posteriormente borrarlos del Blob
        const rutas = (await db.select({rutaSonido: Audios.rutaSonido, rutaImagen: Audios.rutaImagen}).from(Audios).where(inArray(Audios.idAudio, idsAudio)));
        const rutasSonido = rutas.map((row) => row.rutaSonido)
        const rutasImagen = rutas.map((row) => row.rutaImagen)
        console.log(rutasSonido);
        del(rutasSonido)
        console.log(rutasImagen);
        del(rutasImagen)

        //Borramos los registros de la BD
        await db.delete(Album_Audio).where(eq(Album_Audio.idAudio, idAlbum));
        await db.delete(Audios).where(inArray(Audios.idAudio, idsAudio));
    }
    
    //Borramos los registros de la BD

    await db.delete(Album).where(eq(Album_Audio.idAudio, idAlbum));    
    
    return new Response('Album borrado', {status: 200})
}
