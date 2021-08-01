import { Response } from 'express';
import { IVerifyToken } from '../protocols';
import AuthMiddleware from './Auth';

const makeVerifyToken = (): IVerifyToken => {
  class VerifyTokenStub implements IVerifyToken {
    verify(token: string, key: string) {
      return true;
    }
  }

  return new VerifyTokenStub();
};

interface ISut {
  sut: AuthMiddleware;
  verifyTokenStub: IVerifyToken;
}

const makeSut = (): ISut => {
  const verifyTokenStub = makeVerifyToken();
  const sut = new AuthMiddleware(verifyTokenStub);

  return {
    sut,
    verifyTokenStub,
  };
};

describe('Auth Middleware', () => {
  let res: Partial<Response>;
  let req: any; // eslint-disable-line
  let next: any; // eslint-disable-line

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'any_token',
      },
    };
    res = {
      json: jest.fn().mockImplementation(result => {
        return result;
      }),
      status: jest.fn().mockImplementation(() => {
        return res;
      }),
    };
    next = jest.fn().mockReturnThis();
  });

  test('Should return error if token is no provided', () => {
    const { sut } = makeSut();
    req.headers.authorization = '';

    sut.isValid(req, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      error: 'Token no provided',
    });
  });

  test('Should return error if provided token no has 2 parts', () => {
    const { sut } = makeSut();

    req.headers.authorization = 'incomplete_token';

    sut.isValid(req, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      error: 'Incomplete token',
    });
  });

  test('Should return error if provided token no is a Bearer token', () => {
    const { sut } = makeSut();

    req.headers.authorization = 'invalid_type token';

    sut.isValid(req, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid token type',
    });
  });

  test('Should return error if if token is invalid', () => {
    const { sut, verifyTokenStub } = makeSut();

    jest.spyOn(verifyTokenStub, 'verify').mockReturnValueOnce(false);

    req.headers.authorization = 'Bearer invalid_token';

    sut.isValid(req, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid token',
    });
  });

  test('Should return error if verify token throws', () => {
    const { sut, verifyTokenStub } = makeSut();

    jest.spyOn(verifyTokenStub, 'verify').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    req.headers.authorization = 'Bearer invalid_token';

    sut.isValid(req, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      error: 'Server error',
    });
  });
});
