import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export class CustomValidators {

  static passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      
      if (!(formGroup instanceof FormGroup)) {
        console.error('passwordMatchValidator deve ser aplicado a um FormGroup.');
        return null;
      }

      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (!control || !matchingControl) {
        console.error('Controles de senha não encontrados no FormGroup.');
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }
  static cpfValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      
      if (!control.value) {
        return null;
      }

      const cpf = control.value.replace(/[^\d]/g, ''); 

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

      return null; 
    };
  }

  static cnpjValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; 
      }

      const cnpj = control.value.replace(/[^\d]/g, ''); 

      if (cnpj.length !== 14) {
        return { cnpjInvalido: true };
      }

      
      if (/^(\d)\1{13}$/.test(cnpj)) {
        return { cnpjInvalido: true };
      }

      
      let length = 12;
      let numbers = cnpj.substring(0, length);
      let sum = 0;
      let pos = length - 7;
      for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i), 10) * pos--;
        if (pos < 2) {
          pos = 9;
        }
      }
      let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      if (result !== parseInt(cnpj.charAt(12), 10)) {
        return { cnpjInvalido: true };
      }

      
      length = 13;
      numbers = cnpj.substring(0, length);
      sum = 0;
      pos = length - 7;
      for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i), 10) * pos--;
        if (pos < 2) {
          pos = 9;
        }
      }
      result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      if (result !== parseInt(cnpj.charAt(13), 10)) {
        return { cnpjInvalido: true };
      }

      return null; 
    };
  }

  static minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      
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