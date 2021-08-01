import { ISession } from '../protocols';
import SessionRepository from './SessionRepository';

describe('Session Repository', () => {
  let sut: SessionRepository;
  let session: ISession;

  beforeEach(() => {
    sut = new SessionRepository();
    session = {
      cpf: 'any_cpf',
      ip: 'any_ip',
      token: 'any_token',
    };
  });

  test('Should be able create a user session', () => {
    expect(sut.createSession(session)).toBeUndefined();
  });

  test('Should be able fetch a session if this exist', () => {
    sut.createSession(session);
    const fetchSession = sut.getSession(`Bearer ${session.token}`);

    expect(fetchSession).toEqual({
      ...session,
      token: `Bearer ${session.token}`,
    });
  });

  test('Should be return null if the session no exist', () => {
    const fetchSession = sut.getSession(`Bearer ${session.token}`);

    expect(fetchSession).toBeNull();
  });

  test('Should be able override a session if this already exist', () => {
    sut.createSession(session);
    session.token = 'other_token';
    sut.createSession(session);

    const fetchSession = sut.getSession(`Bearer ${session.token}`);

    expect(fetchSession).toEqual({
      ...session,
      token: `Bearer ${session.token}`,
    });
  });
});
