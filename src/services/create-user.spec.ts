import { IHash, IUser, IUserRepository } from '../protocols';
import CreateUserService from './CreateUserService';

const makeUserRepositoryStub = (): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    createUser(data: IUser): Omit<IUser, 'password'> {
      const fakeUser = {
        name: 'Jonathan da Cunha Oliveira',
        birth: '1994-11-14',
        cpf: '111.222.333-45',
        rg: 'RG12345-67',
      };

      return fakeUser;
    }

    getUser(cpf: string): IUser | null {
      return null;
    }
  }

  return new UserRepositoryStub();
};

const makeHashAgentStub = (): IHash => {
  class HashAgentStub implements IHash {
    hash(payload: string, salt: number | string | undefined): string {
      return 'passwrod_hash';
    }
  }
  return new HashAgentStub();
};

interface ISut {
  userRepositoryStub: IUserRepository;
  hashAgentStub: IHash;
  sut: CreateUserService;
}

const makeSut = (): ISut => {
  const userRepositoryStub = makeUserRepositoryStub();
  const hashAgentStub = makeHashAgentStub();
  const sut = new CreateUserService(userRepositoryStub, hashAgentStub);

  return {
    sut,
    userRepositoryStub,
    hashAgentStub,
  };
};

describe('Create User Service', () => {
  let data: IUser;

  beforeEach(() => {
    data = {
      name: 'any_name',
      birth: 'any_birth',
      cpf: 'any_cpf',
      rg: 'any_rg',
      password: 'any_password',
    };
  });

  test('Should be able create a account', () => {
    const { sut } = makeSut();

    const newAccount = sut.execute(data);
    expect(newAccount).toEqual({
      name: 'Jonathan da Cunha Oliveira',
      birth: '1994-11-14',
      cpf: '111.222.333-45',
      rg: 'RG12345-67',
    });
  });

  test('Should return a error if already exists an account with cpf provided', () => {
    const { sut, userRepositoryStub } = makeSut();
    jest.spyOn(userRepositoryStub, 'getUser').mockReturnValueOnce({
      name: 'Jonathan da Cunha Oliveira',
      birth: '1994-11-14',
      cpf: '111.222.333-45',
      rg: 'RG12345-67',
      password: 'any_password',
    });

    data.cpf = '111.222.333-45';

    const createAccountError = () => {
      sut.execute(data);
    };

    expect(createAccountError).toThrow();
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

  test('Should return a error if hashAgent throws', () => {
    const { sut, hashAgentStub } = makeSut();
    jest.spyOn(hashAgentStub, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const createAccountError = () => {
      sut.execute(data);
    };

    expect(createAccountError).toThrow();
  });

  test('Should return a error if createUser throws', () => {
    const { sut, userRepositoryStub } = makeSut();
    jest.spyOn(userRepositoryStub, 'createUser').mockImplementationOnce(() => {
      throw new Error();
    });

    const createAccountError = () => {
      sut.execute(data);
    };

    expect(createAccountError).toThrow();
  });
});
