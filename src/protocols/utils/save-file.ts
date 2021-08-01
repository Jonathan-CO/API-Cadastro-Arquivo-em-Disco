export interface ISaveFile {
  save: (file: string, data: string) => boolean | void;
}
