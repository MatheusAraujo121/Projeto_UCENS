import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  /**
   * Valida um CPF brasileiro. Só executa se o campo tiver valor.
   */
  static cpfValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Se o campo estiver vazio, não faz a validação e retorna nulo (sem erro).
      if (!control.value) {
        return null;
      }

      const cpf = control.value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return { cpfInvalido: true };
      }

      let sum = 0;
      let remainder;

      for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) {
        remainder = 0;
      }
      if (remainder !== parseInt(cpf.substring(9, 10), 10)) {
        return { cpfInvalido: true };
      }

      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) {
        remainder = 0;
      }
      if (remainder !== parseInt(cpf.substring(10, 11), 10)) {
        return { cpfInvalido: true };
      }

      return null; // CPF Válido
    };
  }

  /**
   * Valida se a data de nascimento corresponde a uma idade mínima.
   * @param minAge A idade mínima em anos.
   */
  static minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Se o campo estiver vazio, não valida (deixa para o Validators.required cuidar disso)
      if (!control.value) {
        return null;
      }
      const birthDate = new Date(control.value);
      const today = new Date();
      
      const minAgeDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

      if (birthDate > minAgeDate) {
        return { idadeMinima: { requiredAge: minAge } };
      }
      
      return null;
    };
  }
}