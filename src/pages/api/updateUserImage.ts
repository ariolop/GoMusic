import type { APIContext } from "astro";
import { put } from "@vercel/blob";
import { db, Session, Usuario, eq } from "astro:db";


export async function POST(context: APIContext): Promise<Response> {
    //Read the form data
    const formData = await context.request.formData();
    const image = formData.get("file_image") as File;
    console.log(image);

    //Subimos la imagen al servidor y obtenemos la URL
    const { url } = await put("imagenesPerfil/" + image.name, image, { access: 'public' });

    const idSession = context.cookies.get('auth_session').value
    const userId = (await db.select({userId: Session.userId}).from(Session).where(eq(Session.id, idSession)))[0].userId
    
    await db.update(Usuario)
    .set({
        imagenPerfil: url
    })
    .where(
        eq(Usuario.id, userId)
    );

    return context.redirect("/perfil?imagen=correcta");
}
