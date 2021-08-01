import { Request, Response, NextFunction } from 'express';

export interface IVerifyToken {
  verify: (token: string, key: string, option?: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface ISignToken {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  sign: (
    payload: string | Record<string, unknown> | Buffer,
    key: any,
    option?: any,
  ) => any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export interface IAuthMiddleware {
  isValid: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Response | NextFunction | void;
}
