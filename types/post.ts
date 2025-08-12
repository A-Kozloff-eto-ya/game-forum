import type { User } from "./user"

export interface Image {
  id: string
  posts_id: number
  directus_files_id: string
}

export type Files = File & Image

export interface UserPost {
  id?: string
  title: string
  description: string
  images: Image[]
  likes?: string
  user_created?: User
}