import {
  IUserRepository,
  IUser,
  IRequest,
  ICreateUser,
  IHash,
} from '../protocols';

class CreateUserService implements ICreateUser {
  private readonly userRepository: IUserRepository;

  private readonly hashAgent: IHash;

  constructor(userRepository: IUserRepository, hashAgent: IHash) {
    this.userRepository = userRepository;
    this.hashAgent = hashAgent;
  }

  public execute(data: IRequest): Omit<IUser, 'password'> {
    const findUser = this.userRepository.getUser(data.cpf);

    const hashPassword = this.hashAgent.hash(data.password, 8);

    if (!findUser)
      return this.userRepository.createUser({
        ...data,
        password: hashPassword,
      });

    throw Error('The user already exists');
  }
}

export default CreateUserService;
