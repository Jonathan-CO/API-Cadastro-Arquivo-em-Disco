import Session from '../models/Session';
import { ISession, ISessionRepository } from '../protocols';

export default class SessionRepository implements ISessionRepository {
  private sessions: ISession[];

  constructor() {
    this.sessions = [];
  }

  public createSession({ cpf, ip, token }: ISession): void {
    try {
      const session = new Session({ cpf, ip, token: `Bearer ${token}` });

      const sessionIndex = this.sessions.findIndex(
        userSession => userSession.cpf === cpf,
      );

      if (sessionIndex === -1) this.sessions.push(session);
      else this.sessions[sessionIndex] = session;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public getSession(token: string): ISession | null {
    const authUser = this.sessions.find(session => session.token === token);
    return authUser || null;
  }
}
