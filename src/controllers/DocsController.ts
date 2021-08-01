import { Request, Response } from 'express';
import { IGenerateDocService } from '../protocols';

export default class DocsController {
  private readonly generateDocUser: IGenerateDocService;

  constructor(generateDocUser: IGenerateDocService) {
    this.generateDocUser = generateDocUser;
  }

  public create(req: Request, res: Response): Response {
    try {
      const token = req.headers.authorization || '';

      if (!token) {
        throw new Error('Token no provided');
      }

      this.generateDocUser.execute({ token });

      return res.status(201).json(true);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
