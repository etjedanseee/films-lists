export interface IUser {
  id: string,
  email: string,
}

export interface AuthState {
  user: IUser | null,
}

export enum AuthActionTypes {
  SET_USER = 'SET_USER',
}

interface setUser {
  type: AuthActionTypes.SET_USER,
  payload: IUser | null
}

export type AuthAction = setUser
