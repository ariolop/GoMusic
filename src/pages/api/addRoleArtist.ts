import type { APIContext } from "astro";
import { db, Session, Artista, eq } from "astro:db";
import { generateId } from "lucia";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {

    const session = context.cookies.get('auth_session').value
    const userId = (await db.select({userId: Session.userId}).from(Session).where(eq(Session.id, session)))[0].userId
    console.log(userId)

    const artistaId = generateId(9);

    await db.insert(Artista).values([
        {
            idArtista: artistaId,
            idUsuario: userId
        }
    ])

    return context.redirect("/perfil?rol=artista");
}
