import { put } from "@vercel/blob";
import type { APIContext } from "astro";
import { db, Session, Usuario, Audios, eq, Artista, Album_Audio } from "astro:db";
import { generateId } from "lucia";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {

    const form = await context.request.formData();
    const inputTitulo = form.get('nombreAudio');
    const inputAutoresSecundarios = form.get('autoresSecundarios');
    const inputGenero = form.get('genero');
    const inputTipo = form.get('tipo');
    const inputAlbum = form.get('album');
    const inputPortada = form.get('imageFile') as File;
    const inputAudio = form.get('audioFile') as File;
    const inputDescripcion = form.get('descripcion')
    const inputEsSencillo = form.get('esSencillo')
    const inputAlbumSencillo = form.get('albumSencillo')

    //Validamos que estén todos los campos
    if (!inputTitulo || !inputGenero || !inputTipo || !inputAlbum || !inputPortada || !inputAudio) //En HTML los inputs y select son required
    {
        //return context.redirect("/insertarAudio?datos=faltan")
        return new Response("Faltan datos", {status: 400})
    }
    
    //Obtenemos el userId y el nombre completo del artista
    const sessionId = context.cookies.get("auth_session").value
    const userId = (await db.select({userId: Session.userId})
                            .from(Session)
                            .where(eq(Session.id, sessionId)))[0].userId

    const idArtista = (await db.select({idArtista: Artista.idArtista})
                                            .from(Artista)  
                                            .where(eq(Artista.idUsuario, userId)))[0].idArtista


    const idAlbum = inputAlbum.toString()
    const hoy = Date.now()

    //Obtenemos todos los campos de la tabla Audios
    const idAudio = generateId(9)
    console.log(idAudio);
    
    const nombreAudio = inputTitulo.toString()
    console.log(nombreAudio);

    const descripcion = inputDescripcion ? inputDescripcion.toString() : ""
    console.log(descripcion);

    const genero = inputGenero.toString()
    console.log(genero);

    const tipo = inputTipo.toString()
    console.log(tipo);


    const { url: urlImage } = await put("portadas/" + idArtista + "/" + idAlbum + "/" + inputPortada.name, inputPortada, { access: 'public' });
    console.log(urlImage);
    
    const { url: urlAudio } = await put("audios/" + idArtista + "/" + idAlbum + "/" + inputAudio.name, inputAudio, { access: 'public' });
    console.log(urlAudio);

    const subidoEn = new Date(hoy)
    console.log(subidoEn);

    const autores_secundarios = inputAutoresSecundarios ? inputAutoresSecundarios.toString() : ""
    console.log(autores_secundarios);
    

    console.log("Insertamos el registro en la tabla Audios");

    //Insertamos el registro en la tabla Audios
    await db.insert(Audios).values([
        {
            idAudio,
            nombreAudio,
            descripcion,
            genero,
            tipo,
            rutaImagen: urlImage,
            rutaSonido: urlAudio,
            subidoEn,
            autores_secundarios,
            archivoSonidoOriginal: inputAudio.name
        }
    ])

    //Obtenemos todas los campos de la tabla Album_Audio
    const idAlbumAudio = generateId(9)

    //Insertamos el registro en la tabla Album_Audio
    await db.insert(Album_Audio).values([
        {
            idAlbumAudio,
            idAlbum,
            idAudio
        }
    ])

    if(inputEsSencillo.valueOf() && inputAlbumSencillo.toString())
    {
        const idAlbumSencillo = inputAlbumSencillo.toString()
        const idAlbumSencilloAudio = generateId(9)

        await db.insert(Album_Audio).values([
            {
                idAlbumAudio: idAlbumSencilloAudio,
                idAlbum: idAlbumSencillo,
                idAudio
            }
        ])
    }

    return new Response("ok", {status: 200})
    //return context.redirect("/insertarAudio?insertar=correcto")

}
