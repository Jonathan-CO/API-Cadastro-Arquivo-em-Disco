import { Response } from 'express';
import { IGenerateDocService, IGenerateRequest } from '../protocols';
import DocsController from './DocsController';

const makeGenerateDocs = (): IGenerateDocService => {
  class GenerateDocStub implements IGenerateDocService {
    execute(data: IGenerateRequest): boolean {
      return true;
    }
  }

  return new GenerateDocStub();
};

interface ISut {
  sut: DocsController;
  generateDocs: IGenerateDocService;
}

const makeSut = (): ISut => {
  const generateDocs = makeGenerateDocs();
  const sut = new DocsController(generateDocs);

  return {
    sut,
    generateDocs,
  };
};

describe('Docs Controller', () => {
  let res: Partial<Response>;
  let req: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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
      params: {},
      ip: 'any_ip',
      headers: {
        authorization: 'any_token',
      },
    };
  });

  test('Shoudl return 400 if token no provided', () => {
    const { sut } = makeSut();

    req.headers.authorization = '';

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Token no provided',
    });
  });

  test('Should be return a error if no exist session to the provided token', () => {
    const { sut, generateDocs } = makeSut();
    jest.spyOn(generateDocs, 'execute').mockImplementationOnce(() => {
      throw new Error('No exist session to the token provided');
    });

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'No exist session to the token provided',
    });
  });

  test('Should be return a error if generateDocs throws', () => {
    const { sut, generateDocs } = makeSut();
    jest.spyOn(generateDocs, 'execute').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server error',
    });
  });

  test('Should be return true if doc has been generated with sucess', () => {
    const { sut } = makeSut();

    sut.create(req, res as Response);
    expect(res.json).toHaveBeenCalledWith(true);
  });

  test('Should be return status 200 if doc has been generated with sucess', () => {
    const { sut } = makeSut();

    sut.create(req, res as Response);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
