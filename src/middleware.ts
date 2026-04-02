import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
	const currentUrl = new URL(context.request.url);

	if (currentUrl.href.includes('/@')) return next();
	if (currentUrl.href.includes('/api')) return next();
	if (currentUrl.searchParams.size === 0) return next();

	return next(currentUrl.pathname + currentUrl.search);
});
