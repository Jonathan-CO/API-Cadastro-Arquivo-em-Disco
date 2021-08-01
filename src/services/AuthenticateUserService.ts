import {
  ISessionRepository,
  IUserRepository,
  IAuthenticate,
  IAuthRequest,
  ISignToken,
  ICompareHash,
} from '../protocols';

class AuthenticateUserService implements IAuthenticate {
  private readonly userRepository: IUserRepository;

  private readonly sessionRepository: ISessionRepository;

  private readonly tokenAgent: ISignToken;

  private readonly hashAgent: ICompareHash;

  constructor(
    userRepository: IUserRepository,
    sessionRepository: ISessionRepository,
    tokenAgent: ISignToken,
    hashAgent: ICompareHash,
  ) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
    this.tokenAgent = tokenAgent;
    this.hashAgent = hashAgent;
  }

  public execute({ cpf, password, ip }: IAuthRequest): string {
    const jwtKey = String(process.env.JWT_KEY);

    const user = this.userRepository.getUser(cpf);

    if (!user || !this.hashAgent.compare(password, user.password))
      throw Error('Authentication failed');

    const token = this.tokenAgent.sign({ user: user.name }, jwtKey, {
      expiresIn: 60,
    });

    this.sessionRepository.createSession({ cpf, ip, token });

    return token;
  }
}

export default AuthenticateUserService;
