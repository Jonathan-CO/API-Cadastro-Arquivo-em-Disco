import { ISession } from '../protocols';

class Session implements ISession {
  cpf: string;

  ip: string;

  token: string;

  constructor({ cpf, ip, token }: ISession) {
    this.cpf = cpf;
    this.ip = ip;
    this.token = token;
  }
}

export default Session;
