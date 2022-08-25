import { User } from "./user";

export interface Message {
  id: number
  user_id: number
  text: string
  send_at: Date
  user: User
}