import User from '../models/User';
import { IUserRepository, IUser } from '../protocols';

export default class UserRepository implements IUserRepository {
  users: User[];

  constructor() {
    this.users = [];
  }

  public createUser({
    name,
    birth,
    cpf,
    rg,
    password,
  }: IUser): Omit<IUser, 'password'> {
    const user = new User({ name, birth, cpf, rg, password });
    this.users.push(user);

    const returnUser = {
      name,
      birth,
      cpf,
      rg,
    };
    return returnUser;
  }

  public getUser(cpf: string): IUser | null {
    const foundUser = this.users.find(user => user.cpf === cpf);
    return foundUser || null;
  }
}
