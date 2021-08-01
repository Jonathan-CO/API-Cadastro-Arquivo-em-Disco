import {
  IGenerateRequest,
  ISession,
  ISessionRepository,
  IUser,
  IUserRepository,
  ISaveFile,
} from '../protocols';
import GenerateDocService from './GenerateDocService';

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
    createSession(data: ISession): void { }; // eslint-disable-line

    getSession(token: string): ISession | null {
      return {
        cpf: 'any_cpf',
        ip: 'any_ip',
        token: 'any_token',
      };
    }
  }

  return new SessionRepositoryStub();
};

const makeSaveFileStub = (): ISaveFile => {
  class SaveFileStub implements ISaveFile {
    save(file: string, data: string): boolean {
      return true;
    }
  }

  return new SaveFileStub();
};

interface ISut {
  sut: GenerateDocService;
  userRepositoryStub: IUserRepository;
  sessionRepositoryStub: ISessionRepository;
  saveFileStub: ISaveFile;
}

const makeSut = (): ISut => {
  const userRepositoryStub = makeUserRepositoryStub();
  const sessionRepositoryStub = makeSessionRepositoryStub();
  const saveFileStub = makeSaveFileStub();
  const sut = new GenerateDocService(
    userRepositoryStub,
    sessionRepositoryStub,
    saveFileStub,
  );

  return {
    sut,
    userRepositoryStub,
    sessionRepositoryStub,
    saveFileStub,
  };
};

describe('Generate Doc Service', () => {
  let data: IGenerateRequest;
  beforeEach(() => {
    data = {
      token: 'any_token',
    };
  });

  test('Should return error if not found session', () => {
    const { sut, sessionRepositoryStub } = makeSut();
    jest.spyOn(sessionRepositoryStub, 'getSession').mockReturnValueOnce(null);

    const session = () => {
      sut.execute(data);
    };

    expect(session).toThrowError('Session not found');
  });

  test('Should return error if not found user', () => {
    const { sut, userRepositoryStub } = makeSut();
    jest.spyOn(userRepositoryStub, 'getUser').mockReturnValueOnce(null);

    const session = () => {
      sut.execute(data);
    };

    expect(session).toThrowError('User not found');
  });

  test('Should return error if save file throws', () => {
    const { sut, saveFileStub } = makeSut();
    jest.spyOn(saveFileStub, 'save').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const session = () => {
      sut.execute(data);
    };

    expect(session).toThrowError('Server error');
  });

  test('Should return false if no save file return false', () => {
    const { sut, saveFileStub } = makeSut();
    jest.spyOn(saveFileStub, 'save').mockImplementationOnce(() => {
      return false;
    });

    const session = sut.execute(data);

    expect(session).toEqual(false);
  });

  test('Should return false if no save file return void', () => {
    const { sut, saveFileStub } = makeSut();
    jest.spyOn(saveFileStub, 'save').mockImplementationOnce(() => {}); // eslint-disable-line

    const session = sut.execute(data);

    expect(session).toEqual(false);
  });

  test('Should return true if save file with sucess', () => {
    const { sut } = makeSut();

    const response = sut.execute(data);

    expect(response).toEqual(true);
  });
});
