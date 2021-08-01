export interface IAuthRequest {
  cpf: string;
  password: string;
  ip: string;
}

export interface IAuthenticate {
  execute: (data: IAuthRequest) => string;
}
