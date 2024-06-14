import { del, list, put } from "@vercel/blob";
import type { APIContext } from "astro";
import { db, Album, eq, Audios, Artista, Session } from "astro:db";

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
    let nuevoDescripcion = formData.get("nuevoDescripcion")

    idAudio = idAudio.toString()
    nuevoNombre = nuevoNombre ? nuevoNombre.toString() : undefined
    nuevoAutoresSecundarios = nuevoAutoresSecundarios ? nuevoAutoresSecundarios.toString() : undefined
    nuevoGenero = nuevoGenero ? nuevoGenero.toString() : undefined
    nuevoTipo = nuevoTipo ? nuevoTipo.toString() : undefined
    nuevoDescripcion = nuevoDescripcion ? nuevoDescripcion.toString() : undefined
    
    const newInfo = {
        nombreAudio: nuevoNombre,
        descripcion: nuevoDescripcion,
        genero: nuevoGenero,
        tipo: nuevoTipo,
        autores_secundarios: nuevoAutoresSecundarios,
    }

    const audioInfo = (await db.select({nombreAudio: Audios.nombreAudio, descripcion: Audios.descripcion, genero:Audios.genero, tipo:Audios.tipo, autores_secundarios:Audios.autores_secundarios}).from(Audios).where(eq(Audios.idAudio, idAudio)))[0]
    console.log(newInfo);
    
    console.log(audioInfo);
   
    const keysUserInfo = Object.keys(audioInfo)
    const infoUpdated = {
        nombreAudio: undefined,
        descripcion: undefined,
        genero: undefined,
        tipo: undefined,
        autores_secundarios: undefined
    }

    for (let i = 0; i < keysUserInfo.length; i++) 
    {
        const key = keysUserInfo[i]
        
        console.log(newInfo[key]);
        console.log(audioInfo[key]);

        if(newInfo[key] != audioInfo[key])
            infoUpdated[key] = newInfo[key]
    }
   
   
   console.log(infoUpdated);
   
    //Realizamos el UPDATE
    await db.update(Audios)
        .set(infoUpdated)
        .where(eq(Audios.idAudio, idAudio));

    return context.redirect("/perfil?actualizacion=correcta");
}
