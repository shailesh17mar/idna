export enum Entity {
  User = "User",
  Repository = "Repository",
}

export interface User {
  id: number;
  login: string;
  html_url: string;
  avatar_url: string;
  type: Entity;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  owner: User;
}

export interface Result<T> {
  items: T[];
  total_count: number;
}

export type Results = Result<User | Repository>;
