import { IUser } from '../models/user';

export interface IUserRepository {
  createUser: (data: IUser) => Omit<IUser, 'password'>;
  getUser: (cpf: string) => IUser | null;
}
