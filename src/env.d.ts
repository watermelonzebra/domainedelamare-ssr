/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
	readonly PUBLIC_SANITY_PROJECT_ID: string;
	readonly PUBLIC_SANITY_DATASET: string;

	// Urls
	readonly PUBLIC_SANITY_STUDIO_URL: string;
	readonly PUBLIC_WEBSITE_URL: string;

	// VisualEditing
	readonly SECRET_SANITY_READ_TOKEN: string;

	// API
	readonly SECRET_MAIL_API_KEY: string;
	readonly SECRET_MAIL_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace App {
	interface Locals {
		isDraftMode: boolean;
	}
}
