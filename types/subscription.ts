import type { User } from "./user";

export interface Subscription {
  id: string;
  subscriber: User
  subscribed_to: User
}