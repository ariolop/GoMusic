import { put } from "@vercel/blob";
import type { APIContext } from "astro";
import { db, Session, Usuario, Audios, eq, Album, Album_Cancion } from "astro:db";
import { generateId } from "lucia";

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

    //Validamos que estén todos los campos
    if (!inputTitulo || !inputGenero || !inputTipo || !inputAlbum || !inputPortada || !inputAudio) //En HTML los inputs y select son required
    {
        return context.redirect("/insertarAudio?datos=faltan")
    }

    //Obtenemos el userId y el nombre completo del artista
    const sessionId = context.cookies.get("auth_session").value
    const userId = (await db.select({userId: Session.userId})
                            .from(Session)
                            .where(eq(Session.id, sessionId)))[0].userId

    const nombreCompletoArtista = (await db.select({nombre: Usuario.nombre, apellidos: Usuario.apellidos})
                                            .from(Usuario)  
                                            .where(eq(Usuario.id, userId)))[0]

    const nombreArtista = nombreCompletoArtista.nombre + "_" + nombreCompletoArtista.apellidos                                        

    const nombreAlbum = db.select({nombreAlbum: Album.nombreAlbum}).from(Album).where(eq(Album.idAlbum, inputAlbum.toString()))
    const hoy = Date.now()

    //Obtenemos todos los campos de la tabla Audios
    const idAudio = generateId(9)
    const nombreAudio = inputTitulo.toString()
    const descripcion = inputDescripcion.toString()
    const genero = inputGenero.toString()
    const tipo = inputTitulo.toString()
    const { url: urlImage } = await put("portadas/" + nombreArtista + "/" + nombreAlbum + "/" + inputPortada.name, inputPortada, { access: 'public' });
    const { url: urlAudio } = await put("audios/" + nombreArtista + "/" + nombreAlbum + "/" + inputAudio.name, inputAudio, { access: 'public' });
    const subidoEn = new Date(hoy)
    const autores_secundarios = inputAutoresSecundarios.toString()

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
            autores_secundarios
        }
    ])

    //Obtenemos todas los campos de la tabla Album_Audio
    const idAlbumAudio = generateId(9)
    const idAlbum = inputAlbum.toString()

    //Insertamos el registro en la tabla Album_Audio
    await db.insert(Album_Cancion).values([
        {
            idAlbumAudio,
            idAlbum,
            idAudio
        }
    ])

    return context.redirect("/insertarAudio?insertar=correcto")
}
