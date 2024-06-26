import { list } from "@vercel/blob";
import type { APIContext } from "astro";
import { db, Usuario, Normal, eq, or, Playlist } from "astro:db";
import { generateId } from 'lucia';
import { Argon2id } from "oslo/password";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {
    //Parse the form data
    const formData = await context.request.formData();
    const username = formData.get("username");
    const name = formData.get("name");
    const surname = formData.get("surname");
    const email = formData.get("email");
    const password = formData.get("password");

    //Validate the form data (aquí no debería entrar nunca porque los campos requeridos tienen "required")
    if (!email ||!password || !username ||!name) {
        return new Response('Falta algún campo de los requeridos', { status: 400 })
    }

    //Validamos que el nombre de usuario y el email no existen
    const existeUsuario = await db.select({email: Usuario.email, username: Usuario.username}).from(Usuario)
                            .where(
                                or(
                                    eq(Usuario.email, email.toString().toLowerCase()),
                                    eq(Usuario.username, username.toString())
                                )
                            )    

    if (existeUsuario.length > 0)
        return new Response('Usuario existente', { status: 400, statusText: 'usuario' })
        
    //Validate the strength password
    if ( password.toString().length < 8 || 
        !password.toString().match(/[$@#&!]+/) ||
        !password.toString().match(/[0-9]+/) ||
        !password.toString().match(/[A-Z]+/) || 
        !password.toString().match(/[a-z]+/) 
    ) {
        return new Response('Contrasena invalida', { status: 400, statusText: 'contrasena' })
    }

    //Generamos el id y encriptamos la contraseña
    const userId = generateId(9);
    const hashedPassword = await new Argon2id().hash(password.toString());

    //Seleccionamos una imagen defult de forma aleatoria
    let { blobs: listImageDefault } = await list({ mode: 'folded' ,prefix: "imagenesPerfil/default/" });
    listImageDefault = listImageDefault.filter((row) => row.size > 0)

    const randomPosition = Math.floor(Math.random() * listImageDefault.length) 
    const userImage = listImageDefault[randomPosition].url

    //Insertamos el registro en la tabla Usuario en la BD
    await db.insert(Usuario).values([
        {
            id: userId,
            username: username.toString(),
            nombre: name.toString(),
            apellidos: surname.toString(),
            email: email.toString().toLowerCase(),
            contrasena: hashedPassword,
            imagenPerfil: userImage
        }
    ])

    const idNormal = generateId(9)
    //Insertamos el registro en la tabla Normal en la BD
    await db.insert(Normal).values([
        {
            idNormal,
            idUsuario: userId
        }
    ])

    //Redirect to login para que inicie sesión
    return new Response(JSON.stringify(listImageDefault), { status: 200 }); 
}
