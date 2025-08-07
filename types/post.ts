export interface Image {
  id: number
  posts_id: number
  directus_files_id: number
}

export interface UserPost {
  id: string
  title: string
  description: string
  images: Image[]
  likes: string
  user_created: string
}