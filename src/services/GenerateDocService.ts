import path from 'path';

import {
  IUserRepository,
  ISessionRepository,
  IGenerateRequest,
  IGenerateDocService,
  ISaveFile,
} from '../protocols';

class GenerateDocService implements IGenerateDocService {
  private readonly userRepository: IUserRepository;

  private readonly sessionRepository: ISessionRepository;

  private readonly saveFileAgent: ISaveFile;

  constructor(
    userRepository: IUserRepository,
    sessionRepository: ISessionRepository,
    saveFileAgent: ISaveFile,
  ) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
    this.saveFileAgent = saveFileAgent;
  }

  // Corrigir... deve gerar o documento com o ip da requisição e não da sessão
  public execute({ token }: IGenerateRequest): boolean {
    const authUser = this.sessionRepository.getSession(token);

    if (!authUser) throw Error('Session not found');

    const user = this.userRepository.getUser(authUser.cpf);

    if (!user) throw Error('User not found');

    const data =
      `Nome Completo: ${user.name}\n` +
      `Data de Nascimento: ${user.birth}\n` +
      `CPF: ${user.cpf}\n` +
      `RG: ${user.rg}\n\n` +
      `Usuário Autenticado\n` +
      `Login: ${authUser.cpf}\n` +
      `IP: ${authUser.ip}`;

    const file = path.resolve(
      __dirname,
      '..',
      '_generatedDocs',
      `${user.cpf}.txt`,
    );

    return this.saveFileAgent.save(file, data) || false;
  }
}

export default GenerateDocService;
