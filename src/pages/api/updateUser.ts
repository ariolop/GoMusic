import type { APIContext } from "astro";
import { db, Usuario, eq, Session } from "astro:db";
import { getUserActivo } from "../../components/Cookies/Cookies.astro";
import { lucia } from "../../auth";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {
    //Read the form data
    const formData = await context.request.formData();
    let username = formData.get("username")
    let nombre = formData.get("nombre")
    let apellidos = formData.get("apellidos")
    let email = formData.get("email")

    //Validate the form data (como los inputs son required no debería de entrar aquí nunca)
    if (!username ||!nombre || !email) {
        return context.redirect("/perfil?actualizacion=faltanDatos")
    }
    
    //Transformamos los get en String
    const newInfo = {
        username: username.toString(),
        nombre: nombre.toString(),
        apellidos: apellidos.toString(),
        email: email.toString()
    }

    //Obtenemos el usuario al que vamos a editarle los valores
    const session = context.cookies.get('auth_session').value
    const userId = (await db.select({userId: Session.userId}).from(Session).where(eq(Session.id, session)))[0].userId
    console.log(userId)

    //Obtenemos la información del usuario y la comparamos con la nueva para saber que campos se han modificado
    const userInfo = (await db.select({
        username: Usuario.username, nombre: Usuario.nombre, apellidos: Usuario.apellidos, email: Usuario.email
    }).from(Usuario).where(eq(Usuario.id, userId)))[0]

    const keysUserInfo = Object.keys(userInfo)
    const infoUpdated = {
        username: undefined,
        nombre: undefined,
        apellidos: undefined,
        email: undefined
    }

    for (let i = 0; i < keysUserInfo.length; i++) 
    {
        const key = keysUserInfo[i]
        
        if(newInfo[key] != userInfo[key])
            infoUpdated[key] = newInfo[key]
    }

    //Validamos que el username y el email son únicos en la BD
    const usernames = (await db.select({username: Usuario.username}).from(Usuario)).map(x => x.username)
    const emails = (await db.select({email: Usuario.email}).from(Usuario)).map(x => x.email)
    
    if (usernames.includes(infoUpdated.username) || emails.includes(infoUpdated.email)) {
        return context.redirect("/perfil?actualizacion=datosExistentes")
    }

    //Realizamos el UPDATE
    await db.update(Usuario)
        .set(infoUpdated)
        .where(eq(Usuario.id, userId));

    return context.redirect("/perfil?actualizacion=correcta");
}
