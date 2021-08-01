import {
  IAuthRequest,
  ICompareHash,
  ISession,
  ISessionRepository,
  ISignToken,
  IUser,
  IUserRepository,
} from '../protocols';
import AuthenticateUserService from './AuthenticateUserService';

const makeUserRepositoryStub = (): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    createUser(data: IUser): Omit<IUser, 'password'> {
      return {} as Omit<IUser, 'password'>;
    }

    getUser(cpf: string): IUser | null {
      const fakeUser = {
        name: 'Jonathan da Cunha Oliveira',
        birth: '1994-11-14',
        cpf: '111.222.333-45',
        rg: 'RG12345-67',
        password: 'any_password',
      };

      return fakeUser;
    }
  }

  return new UserRepositoryStub();
};

const makeSessionRepositoryStub = (): ISessionRepository => {
  class SessionRepositoryStub implements ISessionRepository {
    createSession = (data: ISession): void => {}; // eslint-disable-line

    getSession(token: string): ISession | null {
      return {} as ISession;
    }
  }

  return new SessionRepositoryStub();
};

const makeHashAgentStub = (): ICompareHash => {
  class HashAgentStub implements ICompareHash {
    compare(password: string, hashCompare: string): boolean {
      return true;
    }
  }
  return new HashAgentStub();
};

const makeSignStub = (): ISignToken => {
  class SignTokenStub implements ISignToken {
    sign(
      payload: string | Record<string, unknown> | Buffer,
      key: string,
    ): string {
      return 'any_token';
    }
  }

  return new SignTokenStub();
};

interface ISut {
  userRepositoryStub: IUserRepository;
  sessionRepositoryStub: ISessionRepository;
  jwt: ISignToken;
  hashAgentStub: ICompareHash;
  sut: AuthenticateUserService;
}

const makeSut = (): ISut => {
  const userRepositoryStub = makeUserRepositoryStub();
  const sessionRepositoryStub = makeSessionRepositoryStub();
  const hashAgentStub = makeHashAgentStub();
  const jwt = makeSignStub();
  const sut = new AuthenticateUserService(
    userRepositoryStub,
    sessionRepositoryStub,
    jwt,
    hashAgentStub,
  );

  return {
    sut,
    userRepositoryStub,
    sessionRepositoryStub,
    jwt,
    hashAgentStub,
  };
};

describe('Authenticate User Service', () => {
  let data: IAuthRequest;

  beforeEach(() => {
    data = {
      cpf: 'any_cpf',
      password: 'any_password',
      ip: 'any_ip',
    };
  });

  test('Should return a error if no exist account with the cpf provided', () => {
    const { sut, userRepositoryStub } = makeSut();
    jest.spyOn(userRepositoryStub, 'getUser').mockReturnValueOnce(null);

    const createAccountError = () => {
      sut.execute(data);
    };

    expect(createAccountError).toThrowError('Authentication failed');
  });

  test('Should return a error if password provided no match', () => {
    const { sut, hashAgentStub } = makeSut();
    jest.spyOn(hashAgentStub, 'compare').mockReturnValueOnce(false);
    data.password = 'invalid_password';

    const createAccountError = () => {
      sut.execute(data);
    };

    expect(createAccountError).toThrowError('Authentication failed');
  });

  test('Should return a error if getUser throws', () => {
    const { sut, userRepositoryStub } = makeSut();
    jest.spyOn(userRepositoryStub, 'getUser').mockImplementationOnce(() => {
      throw new Error();
    });

    const createAccountError = () => {
      sut.execute(data);
    };

    expect(createAccountError).toThrow();
  });

  test('Should return a error if createSession throws', () => {
    const { sut, sessionRepositoryStub } = makeSut();
    jest
      .spyOn(sessionRepositoryStub, 'createSession')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const createAccountError = () => {
      sut.execute(data);
    };

    expect(createAccountError).toThrow();
  });

  test('Should be able authenticate the user', () => {
    const { sut } = makeSut();

    const token = sut.execute(data);
    expect(token).toEqual('any_token');
  });
});
