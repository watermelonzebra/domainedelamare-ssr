// src/lib/sanity.loader.ts
import { sanityClient } from 'sanity:client'; // server-only import
import { setServerClient } from './sanity.store';

setServerClient(sanityClient); // safe — server only

export { loadQuery } from './sanity.store'; // only export server things
