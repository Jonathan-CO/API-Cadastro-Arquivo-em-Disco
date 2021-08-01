export interface IHash {
  hash: (payload: string, salt: number | string | undefined) => string;
}

export interface ICompareHash {
  compare: (password: string, hash: string) => boolean;
}
