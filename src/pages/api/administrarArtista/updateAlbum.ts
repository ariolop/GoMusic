import type { APIContext } from "astro";
import { db, Album, eq } from "astro:db";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {
    //Read the form data
    const formData = await context.request.formData();
    let idAlbum = formData.get("idAlbum")
    let nombreAlbum = formData.get("nombreAlbum")

    if(!idAlbum || !nombreAlbum)
        new Response('Faltan datos', {status: 400})

    idAlbum = idAlbum.toString()
    nombreAlbum = nombreAlbum.toString()
    
    console.log(idAlbum);
    console.log(nombreAlbum);

    //Realizamos el UPDATE
    await db.update(Album)
        .set({
            idAlbum,
            nombreAlbum            
        })
        .where(eq(Album.idAlbum, idAlbum));

    return context.redirect("/perfil?actualizacion=correcta");
}
