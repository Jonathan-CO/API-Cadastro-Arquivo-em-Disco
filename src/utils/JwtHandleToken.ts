import jwt from 'jsonwebtoken';
import { ISignToken, IVerifyToken } from '../protocols';

export class JwtVerifyToken implements IVerifyToken {
  verify(token: string, key: string, options?: any): any { //eslint-disable-line
    try {
      return jwt.verify(token, key, options);
    } catch (error) {
      return false;
    }
  }
}

export class JwtSignToken implements ISignToken {
  sign(payload: string | Record<string, unknown> | Buffer, key: any, options?: any): any { //eslint-disable-line
    return jwt.sign(payload, key, options);
  }
}
