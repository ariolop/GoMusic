import type { APIContext } from "astro";
import { db, Audios, eq, Album_Audio, Album } from "astro:db";

export async function GET(context: APIContext): Promise<Response>  {
    const idAudio = context.url.searchParams.get("idAudio")

    const infoAudio = (await db.select()
                                .from(Audios)
                                .where(eq(Audios.idAudio, idAudio))
                                .rightJoin(Album_Audio, eq(Album_Audio.idAudio, Audios.idAudio))
                                .leftJoin(Album, eq(Album.idAlbum, Album_Audio.idAlbum))
                                .orderBy(Album.esSencillo)
                            )
    
    return new Response(JSON.stringify(infoAudio), {status: 200})
}