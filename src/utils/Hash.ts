import { hashSync, compareSync } from 'bcryptjs';
import { ICompareHash, IHash } from '../protocols';

export class BcryptHash implements IHash {
  hash(payload: string, salt: number | string | undefined): string {
    return hashSync(payload, salt);
  }
}

export class BcryptCompare implements ICompareHash {
  compare(password: string, hashCompare: string): boolean {
    return compareSync(password, hashCompare);
  }
}
