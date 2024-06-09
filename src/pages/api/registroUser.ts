import { list } from "@vercel/blob";
import type { APIContext } from "astro";
import { db, Usuario } from "astro:db";
import { generateId } from 'lucia';
import { Argon2id } from "oslo/password";

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

    //Validate the strength password
    if ( password.toString().length < 8 || 
        !password.toString().match(/[$@#&!]+/) ||
        !password.toString().match(/[0-9]+/) ||
        !password.toString().match(/[A-Z]+/) || 
        !password.toString().match(/[a-z]+/) 
    ) {
        return new Response(password.toString(), { status: 400 })
        //return context.redirect("/registro?contrasena=debil");
    }

    //Generamos el id y encriptamos la contraseña
    const userId = generateId(9);
    const hashedPassword = await new Argon2id().hash(password.toString());

    //Seleccionamos una imagen defult de forma aleatoria
    const { blobs: listImageDefault } = await list({ prefix: "imagenesPerfil/default/" });
    const randomPosition = Math.floor(Math.random() * listImageDefault.length) 
    const userImage = listImageDefault[randomPosition].url

    //Insertamos el registro en la BD
    await db.insert(Usuario).values([
        {
            id: userId,
            username: username.toString(),
            nombre: name.toString(),
            apellidos: surname.toString(),
            email: email.toString(),
            contrasena: hashedPassword,
            imagenPerfil: userImage
        }
    ])

    //Redirect to login para que inicie sesión
    return context.redirect("./../login?usuario=nuevo"); 
}
