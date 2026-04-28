import type { APIRoute } from 'astro';

const baseUrl = import.meta.env.SITE;

export const GET: APIRoute = async () => {
    const llms = `Contact: mailto:info@trustthebelly.be
    Preferred-Languages: nl,en,fr
    Canonical: ${baseUrl}/.well-known/security.txt
    Canonical: ${baseUrl}/security.txt
    Expires: 2027-04-28T07:00:00.000Z
`

    return new Response(llms,{
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        }
    })
}