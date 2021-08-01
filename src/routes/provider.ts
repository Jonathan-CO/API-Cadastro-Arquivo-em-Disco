import CreateUserService from '../services/CreateUserService';
import AuthenticateUserService from '../services/AuthenticateUserService';
import GenerateDocService from '../services/GenerateDocService';

import UserRepository from '../repositories/UserRepository';
import SessionRepository from '../repositories/SessionRepository';

import {
  CpfValidator,
  JwtSignToken,
  JwtVerifyToken,
  FsSaveFile,
  BcryptHash,
  BcryptCompare,
} from '../utils';

import Auth from '../middlewares/Auth';

const cpfValidator = new CpfValidator();
const saveFile = new FsSaveFile();
const jwtSign = new JwtSignToken();
const jwtVerify = new JwtVerifyToken();
const bcryptHash = new BcryptHash();
const bcryptCompare = new BcryptCompare();
const auth = new Auth(jwtVerify);

const userRepository = new UserRepository();
const sessionRepository = new SessionRepository();

const createUser = new CreateUserService(userRepository, bcryptHash);
const createSession = new AuthenticateUserService(
  userRepository,
  sessionRepository,
  jwtSign,
  bcryptCompare,
);
const generateDocUser = new GenerateDocService(
  userRepository,
  sessionRepository,
  saveFile,
);

export {
  auth,
  cpfValidator,
  saveFile,
  jwtSign,
  jwtVerify,
  userRepository,
  sessionRepository,
  createUser,
  createSession,
  generateDocUser,
};
