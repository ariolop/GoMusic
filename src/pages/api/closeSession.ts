import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {

    context.cookies.delete("auth_session", {httpOnly: true, secure: true, path: "/"})

    if (context.cookies.has("auth_session"))
        return new Response("cookie no eliminada", {status: 200});
    else
        return new Response("cookie eliminada", {status: 200});
}