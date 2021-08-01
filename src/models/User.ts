import { IUser } from '../protocols';

class User implements IUser {
  name: string;

  birth: string;

  cpf: string;

  rg: string;

  password: string;

  constructor({ name, birth, cpf, rg, password }: IUser) {
    this.name = name;
    this.birth = birth;
    this.cpf = cpf;
    this.rg = rg;
    this.password = password;
  }
}

export default User;
