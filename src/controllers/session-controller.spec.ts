import { Response } from 'express';
import { IAuthenticate, IAuthRequest } from '../protocols';
import SessionsController from './SessionController';

const makeCreateSession = (): IAuthenticate => {
  class CreateSessionStub implements IAuthenticate {
    execute(data: IAuthRequest): string {
      return 'valid_token';
    }
  }
  return new CreateSessionStub();
};

interface ISut {
  sut: SessionsController;
  createSessionStub: IAuthenticate;
}

const makeSut = (): ISut => {
  const createSessionStub = makeCreateSession();
  const sut = new SessionsController(createSessionStub);

  return {
    sut,
    createSessionStub,
  };
};

describe('Session Controller', () => {
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
      ip: 'any_ip',
    };

    data = {
      cpf: 'any_cpf',
      password: 'any_pass',
    };
  });

  test('Should be return 400 if no cpf is provided', () => {
    const { sut } = makeSut();

    req.body = { ...data, cpf: undefined };

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing param: cpf',
    });
  });

  test('Should be return 400 if no password is provided', () => {
    const { sut } = makeSut();

    req.body = { ...data, password: undefined };

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing param: password',
    });
  });

  test('Should be return 400 if the password provided is incorrect', () => {
    const { sut, createSessionStub } = makeSut();

    jest.spyOn(createSessionStub, 'execute').mockImplementationOnce(() => {
      throw new Error('Invalid credenctials');
    });

    req.body = { ...data, password: 'incorrect_password' };

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid credenctials',
    });
  });

  test('Should be return 400 if no exist account with the cpf provided', () => {
    const { sut, createSessionStub } = makeSut();

    jest.spyOn(createSessionStub, 'execute').mockImplementationOnce(() => {
      throw new Error('Invalid credenctials');
    });

    req.body = { ...data, cpf: 'no_exist_cpf' };

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid credenctials',
    });
  });

  test('Should be return a error if create session throws', () => {
    const { sut, createSessionStub } = makeSut();

    jest.spyOn(createSessionStub, 'execute').mockImplementationOnce(() => {
      throw new Error('Server Error');
    });

    req.body = data;

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server Error',
    });
  });

  test('Should be able create a new session', () => {
    const { sut } = makeSut();

    req.body = data;

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      token: 'valid_token',
    });
  });

  test('Should return 200 if data provided is correct', () => {
    const { sut } = makeSut();

    req.body = data;

    sut.create(req, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
