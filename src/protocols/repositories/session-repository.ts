import { ISession } from '../models/session';

export interface ISessionRepository {
  createSession: (data: ISession) => void;
  getSession: (token: string) => ISession | null;
}
