export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar: string | undefined
  last_access: string | null
  username: string
  subscribers: User[] | null
  subscribed: User[] | null
}