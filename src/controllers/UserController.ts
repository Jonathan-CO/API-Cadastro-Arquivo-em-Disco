import { Request, Response } from 'express';
import { ICpfValidator, ICreateUser } from '../protocols';

export default class UserController {
  private readonly createUser: ICreateUser;

  private readonly cpfValidator: ICpfValidator;

  constructor(createUser: ICreateUser, cpfValidator: ICpfValidator) {
    this.createUser = createUser;
    this.cpfValidator = cpfValidator;
  }

  public create(req: Request, res: Response): Response {
    try {
      const { name, birth, rg, cpf, password } = req.body;
      const requiredFields = ['name', 'birth', 'rg', 'cpf', 'password'];

      for (const field of requiredFields) {
        if (!req.body[field]) {
          throw new Error(`Missing param: ${field}`);
        }
      }

      if (!this.cpfValidator.isValid(cpf)) {
        throw new Error('Invalid param: cpf');
      }

      const user = this.createUser.execute({ name, birth, rg, cpf, password });

      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
