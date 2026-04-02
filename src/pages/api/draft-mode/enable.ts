import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ redirect }) => {
	// No cookie needed — just redirect with the param
	return redirect('/?draft=true', 302);
};
