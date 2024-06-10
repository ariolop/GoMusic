import type { APIContext } from "astro";
import { db, Usuario, eq } from "astro:db";
import { Argon2id } from "oslo/password";
import { lucia } from "../../auth";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {
    //Read the form data
    const formData = await context.request.formData();
    const email = formData.get("email").toString();
    const password = formData.get("password").toString();
    const sesionIniciada = formData.get("sesionIniciada");

    //Validate the form data (como los inputs son required no debería de entrar aquí nunca)
    if (!email ||!password) {
        return new Response(undefined, {status: 400});
    }

    //Find the email
    const foundUser = (await db.select().from(Usuario).where(eq(Usuario.email, email))).at(0)

    if (!foundUser) {
        //return new Response('login', { status: 400 })
        return new Response('Problemas login', {status: 400, statusText: 'problema login'});
    }

    //Validate the password
    const validPassword = await new Argon2id().verify(foundUser.contrasena, password)

    if (!validPassword) {
        return new Response('Problemas login', {status: 400});
    }
    //Generate session
    const session = await lucia.createSession(foundUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    if(!sesionIniciada)
        sessionCookie.attributes.maxAge = null
        sessionCookie.attributes.expires = null
    
    context.cookies.set(
        sessionCookie.name, 
        sessionCookie.value, 
        sessionCookie.attributes
    );

    return new Response("ok", {status: 200});
}
