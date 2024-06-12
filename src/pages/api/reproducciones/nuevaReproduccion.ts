import type { APIContext } from "astro";
import { db, eq, Session, Normal, Usuario_Escucha_Audio } from "astro:db";
import { generateId } from "lucia";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData()
    const idAudio = formData.get("idAudio").toString()

    const idSession = context.cookies.get("auth_session").value
    const idNormal = (await db.select({idNormal: Normal.idNormal}).from(Session).where(eq(Session.id, idSession)).leftJoin(Normal, eq(Session.userId, Normal.idUsuario)))[0].idNormal    
 
    const idEscucha = generateId(9)

    
    console.log(idEscucha);
    console.log(idNormal);
    console.log(idAudio);

    await db.insert(Usuario_Escucha_Audio).values({        
        idEscucha,
        idUsuario: idNormal,
        idAudio
    })
    
    return new Response('Nueva reproducción', {status: 200})
}
