export interface IGenerateRequest {
  token: string;
}

export interface IGenerateDocService {
  execute: (data: IGenerateRequest) => boolean;
}
