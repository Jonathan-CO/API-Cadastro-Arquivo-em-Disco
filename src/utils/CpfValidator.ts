import { ICpfValidator } from '../protocols';

export class CpfValidator implements ICpfValidator {  // eslint-disable-line
  isValid(cpf: string): boolean {
    const cpfToValidate = cpf.replace(/[^\d]+/g, '');
    if (cpf === '') return false;
    if (
      cpfToValidate.length !== 11 ||
      cpfToValidate === '00000000000' ||
      cpfToValidate === '11111111111' ||
      cpfToValidate === '22222222222' ||
      cpfToValidate === '33333333333' ||
      cpfToValidate === '44444444444' ||
      cpfToValidate === '55555555555' ||
      cpfToValidate === '66666666666' ||
      cpfToValidate === '77777777777' ||
      cpfToValidate === '88888888888' ||
      cpfToValidate === '99999999999'
    )
      return false;

    // Valida 1o digito
    let add = 0;
    let i = 0;
    for (i; i < 9; i++) add += parseInt(cpfToValidate.charAt(i), 10) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpfToValidate.charAt(9), 10)) return false;

    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++)
      add += parseInt(cpfToValidate.charAt(i), 10) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpfToValidate.charAt(10), 10)) return false;
    return true;
  }
}
