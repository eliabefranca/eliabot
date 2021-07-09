import { User } from './user';

export interface History {
  user: User;
  message: string;
  create_at: string;
  updated_at: string;
}
