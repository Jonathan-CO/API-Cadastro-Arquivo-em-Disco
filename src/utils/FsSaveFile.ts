import fs from 'fs';
import { ISaveFile } from '../protocols';

export class FsSaveFile implements ISaveFile { // eslint-disable-line
  save(file: string, data: string): boolean | void {
    fs.writeFile(file, data, err => {
      if (err) throw err;
      return true;
    });
  }
}
