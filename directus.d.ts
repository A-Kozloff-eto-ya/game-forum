/// <reference types="@directus/extensions/api.d.ts" />

import type { DirectusFile } from "@directus/sdk";

interface DirectusSchema {
	posts: Post[];
	directus_users: DirectusUser[]
}

interface Image {
	id: string
	posts_id: string
	directus_files_id: string
}

interface Post {
	id: string
	title: string
	description: string
	images: DirectusFile[]
	likes: string
	user_created: string;
}

interface DirectusUser {
	id: string
	first_name: string
	last_name: string
}
