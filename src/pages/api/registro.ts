import type { APIContext } from "astro";
import { db, Usuario } from "astro:db";
import { generateId } from 'lucia';
import { Argon2id } from "oslo/password";
import { lucia } from "../../auth";

export async function POST(context: APIContext): Promise<Response> {
    //Parse the form data
    const formData = await context.request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    //Validate the form data
    if (!email ||!password) {
        return new Response('Username and Password are required', { status: 400 })
    }

    //Insertar user into db
    const userId = generateId(9);
    const hashedPassword = await new Argon2id().hash(password.toString());

    await db.insert(Usuario).values([
        {
            id: userId,
            username: "Test",
            nombre: "",
            apellidos: "",
            email: email.toString(),
            contrasena: hashedPassword
        }
    ])

    //Generate session
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    context.cookies.set(
        sessionCookie.name, 
        sessionCookie.value, 
        sessionCookie.attributes
    );

    return context.redirect("/");
}
