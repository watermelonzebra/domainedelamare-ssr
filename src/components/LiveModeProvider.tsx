import { useLiveMode } from '@sanity/react-loader';
import { browserClient } from '@/lib/sanity.browser-client';

export function LiveModeProvider() {
	useLiveMode({
		client: browserClient,
		onConnect: () => console.log('[Sanity] Live mode connected ✅'),
		onDisconnect: () => console.log('[Sanity] Live mode disconnected ❌'),
		onPerspective: (p) => console.log('[Sanity] live mode perspective: ', p),
	});
	return null;
}
