import { IUser } from '../protocols';
import UserRepository from './UserRepository';

describe('Session Repository', () => {
  let sut: UserRepository;
  let user: IUser;

  beforeEach(() => {
    sut = new UserRepository();
    user = {
      name: 'any_name',
      birth: 'any_birth',
      cpf: 'any_cpf',
      rg: 'any_rg',
      password: 'any_password',
    };
  });

  test('Should be able create a user account', () => {
    const userStatus = sut.createUser(user);

    expect(userStatus).toEqual({
      name: 'any_name',
      birth: 'any_birth',
      cpf: 'any_cpf',
      rg: 'any_rg',
    });
  });

  test('Should be able fetch a account if this exist', () => {
    sut.createUser(user);
    const fetchUser = sut.getUser(user.cpf);

    expect(fetchUser).toEqual(user);
  });

  test('Should be return null if the account no exist', () => {
    const userNoCreated = user;

    const fetchSession = sut.getUser(userNoCreated.cpf);

    expect(fetchSession).toBeNull();
  });
});
