import { IUser } from '../models/user';

export interface IRequest {
  name: string;
  birth: string;
  cpf: string;
  rg: string;
  password: string;
}

export interface ICreateUser {
  execute: (data: IRequest) => Omit<IUser, 'password'>;
}
