/// <reference types="@directus/extensions/api.d.ts" />

interface DirectusSchema {
	posts: Post[];
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
	images: Image[]
	likes: string
	user_created: string;
}
