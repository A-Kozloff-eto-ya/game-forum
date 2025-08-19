import type { User } from "./user"

export interface PostsFile {
  id: number
  posts_id: string
  directus_files_id: string
}

export interface PostLike {
  id: string
  user_id: string
  post_id: string
}

export interface UserPost {
  id: string
  title: string
  description: string
  files: PostsFile[] | null
  likes: User[]
  user_created: User
}

export interface CreatePost {
  title: string
  description: string
  isGallery?: boolean
}

export interface CreateFile {
  files: File
}