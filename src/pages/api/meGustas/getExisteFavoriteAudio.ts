import type { APIContext } from "astro";
import { db, eq, Normal, Usuario_MeGusta_Audio, Session, and } from "astro:db";
import { normalize } from "path";

export async function GET(context: APIContext): Promise<Response>  {
    const idAudio = context.url.searchParams.get("idAudio")

    const session = context.cookies.get('auth_session').value
    const userId = (await db.select({userId: Session.userId}).from(Session).where(eq(Session.id, session)))[0].userId
    const normalId = (await db.select({normalId: Normal.idNormal}).from(Normal).where(eq(Normal.idUsuario, userId)))[0].normalId

    console.log(idAudio);
    console.log(normalId);
    
    const infoAudio = (await db.select().from(
        Usuario_MeGusta_Audio
    ).where(
        and(
            eq(Usuario_MeGusta_Audio.idAudio, idAudio),
            eq(Usuario_MeGusta_Audio.idUsuario, normalId)
        )
    ))

    console.log(infoAudio);

    const existe = infoAudio.length > 0 ? "true" : "false"
    console.log(existe);
    

    return new Response(existe, {status: 200})
}