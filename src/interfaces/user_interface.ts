export interface User {
  id: string;
  displayName: string;
}
export type Users = { [id: string]: User };
