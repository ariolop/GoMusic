import type { APIContext } from "astro";
import { db, Album, eq, Audios } from "astro:db";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {
    //Read the form data
    const formData = await context.request.formData();
    let idAudio = formData.get("idAudio")
    let nuevoNombre = formData.get("nuevoNombre")
    let nuevoAutoresSecundarios = formData.get("nuevoAutoresSecundarios")
    let nuevoGenero = formData.get("nuevoGenero")
    let nuevoTipo = formData.get("nuevoTipo")
    let nuevoAlbum = formData.get("nuevoAlbum")
    let nuevoAudio = formData.get("nuevoAudio")
    let nuevoPortada = formData.get("nuevoPortada")
    let nuevoDescripcion = formData.get("nuevoDescripcion")

    idAudio = idAudio.toString()
    nuevoNombre = nuevoNombre ? nuevoNombre.toString() : undefined
    nuevoAutoresSecundarios = nuevoAutoresSecundarios ? nuevoAutoresSecundarios.toString() : undefined
    nuevoGenero = nuevoGenero ? nuevoGenero.toString() : undefined
    nuevoTipo = nuevoTipo ? nuevoTipo.toString() : undefined
    nuevoAlbum = nuevoAlbum ? nuevoAlbum.toString() : undefined
    nuevoAudio = nuevoAudio ? nuevoAudio.toString() : undefined
    nuevoPortada = nuevoPortada ? nuevoPortada.toString() : undefined
    nuevoDescripcion = nuevoDescripcion ? nuevoDescripcion.toString() : undefined
    
    const newInfo = {
        nombreAudio: nuevoNombre,
        descripcion: nuevoDescripcion,
        genero: nuevoGenero,
        tipo: nuevoTipo,
        rutaImagen: nuevoAlbum,
        rutaSonido: nuevoAudio,
        autores_secundarios: nuevoAutoresSecundarios,
    }

    const audioInfo = (await db.select().from(Audios).where(eq(Audios.idAudio, idAudio)))[0]
    console.log(newInfo);
    
    console.log(audioInfo);
   
    const keysUserInfo = Object.keys(audioInfo).shift()
    const infoUpdated = {
        nombreAudio: undefined,
        descripcion: undefined,
        genero: undefined,
        tipo: undefined,
        rutaImagen: undefined,
        rutaSonido: undefined,
        autores_secundarios: undefined
    }

    for (let i = 0; i < keysUserInfo.length; i++) 
    {
        const key = keysUserInfo[i]
        
        if(newInfo[key] != audioInfo[key])
            infoUpdated[key] = newInfo[key]
    }
   
   
   console.log(infoUpdated);
   
   
    // console.log(idAlbum);
    // console.log(nombreAlbum);

    // //Realizamos el UPDATE
    // await db.update(Album)
    //     .set({
    //         idAlbum,
    //         nombreAlbum            
    //     })
    //     .where(eq(Album.idAlbum, idAlbum));

    return context.redirect("/perfil?actualizacion=correcta");
}
