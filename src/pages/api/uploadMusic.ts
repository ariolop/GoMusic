import { put } from "@vercel/blob";
import type { APIContext } from "astro";
import { db, Session, Usuario, Audios, eq } from "astro:db";

export async function POST(context: APIContext): Promise<Response> {
    const form = await context.request.formData();
    const titulo = form.get('nombreAudio');
    const genero = form.get('genero');
    const tipo = form.get('tipo');
    const album = form.get('album');
    const portada = form.get('imageFile') as File;
    const audio = form.get('audioFile') as File;

    if (!titulo || !genero || !tipo || !album || !portada || !audio) //En HTML los inputs y select son required
    {
        return context.redirect("/insertarAudio?datos=faltan")
    }

    const sessionId = context.cookies.get("auth_session").value
    const userId = (await db.select({userId: Session.userId})
                            .from(Session)
                            .where(eq(Session.id, sessionId)))[0].userId

    const nombreCompletoArtista = (await db.select({nombre: Usuario.nombre, apellidos: Usuario.apellidos})
                                            .from(Usuario)  
                                            .where(eq(Usuario.id, userId)))[0]

    const nombreArtista = nombreCompletoArtista.nombre + "_" + nombreCompletoArtista.apellidos                                        

    const { url: urlImage } = await put("portadas/" + nombreArtista + "/" + album + "/" + portada.name, portada, { access: 'public' });
    const { url: urlAudio } = await put("audios/" + nombreArtista + "/" + album + "/" + audio.name, audio, { access: 'public' });

    await db.insert(Audios).values([
        {
            
        }
    ])

    return context.redirect("/insertarAudio")
}
