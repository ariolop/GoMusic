import type { APIContext } from "astro";
import { put, del, list } from "@vercel/blob";
import { db, Session, Usuario, eq } from "astro:db";
import { date } from "astro/zod";


export async function POST(context: APIContext): Promise<Response> {
    //Read the form data
    const formData = await context.request.formData();
    const image = formData.get("file_image") as File;

    //Obtenemos el userId de la sesion actual
    const idSession = context.cookies.get('auth_session').value
    const userId = (await db.select({userId: Session.userId}).from(Session).where(eq(Session.id, idSession)))[0].userId

    //Borramos la imagen antigua del servidor
    const { blobs } = await list({ prefix: "imagenesPerfil/" + userId + "/" });
    del(blobs[0].url)

    //Subimos la imagen nueva al servidor y obtenemos la URL
    const { url } = await put("imagenesPerfil/" + userId + "/" + image.name, image, { access: 'public' });

    //Actualizamos el registro del usuario de la BD
    await db.update(Usuario)
    .set({
        imagenPerfil: url
    })
    .where(
        eq(Usuario.id, userId)
    );

    return context.redirect("/perfil?imagen=correcta");
}
