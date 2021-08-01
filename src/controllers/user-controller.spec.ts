import { Response } from 'express';
import { IUser, ICreateUser, IRequest, ICpfValidator } from '../protocols';
import UserController from './UserController';

const makeCpfValidator = (): ICpfValidator => {
  class CpfValidatorStub implements ICpfValidator {
    isValid(cpf: string): boolean {
      return true;
    }
  }
  return new CpfValidatorStub();
};

const makeCreateUser = (): ICreateUser => {
  class CreateUserStub implements ICreateUser {
    execute(data: IRequest): Omit<IUser, 'password'> {
      const fakeUser = {
        name: 'Jonathan da Cunha Oliveira',
        birth: '1994-11-14',
        cpf: '111.222.333-45',
        rg: 'RG12345-67',
        // password: '123456',
      };

      return fakeUser;
    }
  }

  return new CreateUserStub();
};

interface ISut {
  sut: UserController;
  createUserStub: ICreateUser;
  cpfValidatorStub: ICpfValidator;
}

const makeSut = (): ISut => {
  const cpfValidatorStub = makeCpfValidator();
  const createUserStub = makeCreateUser();
  const sut = new UserController(createUserStub, cpfValidatorStub);

  return {
    sut,
    createUserStub,
    cpfValidatorStub,
  };
};

describe('User Controller', () => {
  let res: Partial<Response>;
  let req: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let data: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  beforeEach(() => {
    res = {
      json: jest.fn().mockImplementation(result => {
        return result;
      }),
      status: jest.fn().mockImplementation(() => {
        return res;
      }),
    };

    req = {
      body: {},
    };

    data = {
      name: 'Jonathan da Cunha Oliveira',
      birth: 'any_date',
      rg: 'any_rg',
      cpf: 'any_cpf',
      password: 'any_pass',
    };
  });

  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();

    req.body = { ...data, name: undefined };

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing param: name',
    });
  });

  test('Should return 400 if no birth is provided', () => {
    const { sut } = makeSut();

    req.body = { ...data, birth: undefined };

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing param: birth',
    });
  });

  test('Should return 400 if no rg is provided', () => {
    const { sut } = makeSut();

    req.body = { ...data, rg: undefined };

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing param: rg',
    });
  });

  test('Should return 400 if no cpf is provided', () => {
    const { sut } = makeSut();

    req.body = { ...data, cpf: undefined };

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing param: cpf',
    });
  });

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();

    req.body = { ...data, password: undefined };

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing param: password',
    });
  });

  test('Should return 400 if invalid cpf is provided', () => {
    const { sut, cpfValidatorStub } = makeSut();
    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false);

    req.body = { ...data, cpf: 'invalid_cpf' };

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid param: cpf',
    });
  });

  test('Should return a error if CPFValidator throws', () => {
    const { sut, cpfValidatorStub } = makeSut();
    jest.spyOn(cpfValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('Server Error');
    });

    req.body = data;

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server Error',
    });
  });

  test('Should be able create a new account', () => {
    const { sut } = makeSut();

    req.body = data;

    sut.create(req, res as Response);

    expect(res.json).toHaveBeenCalledWith({
      name: 'Jonathan da Cunha Oliveira',
      birth: '1994-11-14',
      cpf: '111.222.333-45',
      rg: 'RG12345-67',
    });
  });

  test('Should return 201 if data provided is correct', () => {
    const { sut } = makeSut();

    req.body = data;

    sut.create(req, res as Response);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('Should not be able to create a user if exists account with cpf provided', () => {
    const { sut, createUserStub } = makeSut();
    jest.spyOn(createUserStub, 'execute').mockImplementationOnce(() => {
      throw new Error('The user already exists');
    });

    req.body = data;

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'The user already exists',
    });
  });
});
