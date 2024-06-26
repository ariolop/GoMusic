import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response>  {
    return context.redirect("/")
}

export async function POST(context: APIContext): Promise<Response> {

    context.cookies.delete("auth_session", {httpOnly: true, secure: true, path: "/"})

    return new Response("cookie eliminada", {status: 200});
}