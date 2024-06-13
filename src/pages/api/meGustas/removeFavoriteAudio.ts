import type { APIContext } from "astro";
import { db, Session, eq, Normal, Usuario_MeGusta_Audio, and } from "astro:db";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData()
    const idAudio = formData.get("idAudio").toString()

    const session = context.cookies.get('auth_session').value
    const userId = (await db.select({userId: Session.userId}).from(Session).where(eq(Session.id, session)))[0].userId
    const normalId = (await db.select({normalId: Normal.idNormal}).from(Normal).where(eq(Normal.idUsuario, userId)))[0].normalId

    await db.delete(Usuario_MeGusta_Audio).where(
        and(
            eq(Usuario_MeGusta_Audio.idAudio, idAudio),
            eq(Usuario_MeGusta_Audio.idUsuario, normalId)
        )
    )

    return new Response("ok", {status: 200});
}
