import type { APIContext } from "astro";
import { db, Session, Artista, Album, eq } from "astro:db";
import { generateId } from "lucia";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {

    const formData = await context.request.formData()
    const nombreAlbum = formData.get("nombreAlbum").toString()

    const session = context.cookies.get('auth_session').value
    const idUsuario = (await db.select({userId: Session.userId}).from(Session).where(eq(Session.id, session)))[0].userId

    const idArtista = (await db.select({idArtista: Artista.idArtista}).from(Artista).where(eq(Artista.idUsuario, idUsuario)))[0].idArtista
    const idAlbum = generateId(9);

    await db.insert(Album).values([
        {
            idAlbum,
            nombreAlbum,
            idArtista
        }
    ])

    return context.redirect("/perfil?album=creado");
}
