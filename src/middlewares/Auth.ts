import { Request, Response, NextFunction } from 'express';
import { IVerifyToken, IAuthMiddleware } from '../protocols';

export default class AuthMiddleware implements IAuthMiddleware {
  private readonly tokenAgent: IVerifyToken;

  constructor(tokenAgent: IVerifyToken) {
    this.tokenAgent = tokenAgent;
  }

  isValid(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response | NextFunction | void {
    try {
      const jwtKey = String(process.env.JWT_KEY);
      const authHeader = req.headers.authorization || '';

      if (!authHeader)
        return res.status(401).json({ error: 'Token no provided' });

      const parts = authHeader.split(' ');
      if (parts.length !== 2)
        return res.status(401).json({ error: 'Incomplete token' });

      const [scheme, token] = parts;
      if (!/^Bearer$/i.test(scheme))
        return res.status(401).json({ error: 'Invalid token type' });

      const decodedToken = this.tokenAgent.verify(token, jwtKey);

      if (!decodedToken) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      next();
    } catch (error) {
      return res.status(400).json({ error: 'Server error' });
    }
  }
}
