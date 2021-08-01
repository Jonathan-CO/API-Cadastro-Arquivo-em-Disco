import { Request, Response } from 'express';
import { IAuthenticate } from '../protocols';

export default class SessionsController {
  private readonly createSession: IAuthenticate;

  constructor(createSession: IAuthenticate) {
    this.createSession = createSession;
  }

  public create(req: Request, res: Response): Response {
    try {
      const { cpf, password } = req.body;
      const ip = req.ip.split(':')[3];

      const requiredFields = ['cpf', 'password'];

      for (const field of requiredFields) {
        if (!req.body[field]) {
          throw new Error(`Missing param: ${field}`);
        }
      }

      const token = this.createSession.execute({ cpf, password, ip });

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
