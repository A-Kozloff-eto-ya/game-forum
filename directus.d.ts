/// <reference types="@directus/extensions/api.d.ts" />

import type { User } from "./types/user";
import type { UserPost, PostsFiles, PostLike } from "./types/post";
import type { Subscription } from "./types/subscription";

interface DirectusSchema {
	posts: UserPost[];
	directus_users: User[];
	posts_files: PostsFiles[]
	posts_likes: PostLike[]
	subscriptions: Subscription[]
}
