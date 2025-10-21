// Dentro do seu arquivo login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginResponse } from 'src/app/services/auth/auth.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  remainingAttempts: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]] // Ajustado para 6 para corresponder ao backend
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      // Marca todos os campos como "tocados" para exibir as mensagens de erro
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.remainingAttempts = null;

    // --- 👇 CORREÇÃO APLICADA AQUI 👇 ---
    // Cria um novo objeto com as propriedades esperadas pelo backend (Email, Senha)
    const credentials = {
      Email: this.loginForm.value.email,
      Senha: this.loginForm.value.password
    };
    // --- 👆 FIM DA CORREÇÃO 👆 ---

    // Envia o objeto 'credentials' corrigido
    this.authService.login(credentials).subscribe({
      next: (response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 429) {
          this.snackBar.open('Você está bloqueado por 10 minutos por muitas tentativas.', 'Fechar', {
            duration: 5000
          });
        } 
        else if (err.status === 401 && err.error?.remainingAttempts !== undefined) {
          this.remainingAttempts = err.error.remainingAttempts;
          this.snackBar.open('E-mail ou senha inválidos.', 'Fechar', {
            duration: 3000
          });
        } 
        // Adicionado para tratar o erro de validação 400
        else if (err.status === 400 && err.error?.errors?.Senha) {
             this.snackBar.open(err.error.errors.Senha[0], 'Fechar', {
            duration: 4000
          });
        }
        else {
          this.snackBar.open('Ocorreu um erro. Tente novamente.', 'Fechar', {
            duration: 3000
          });
        }
        this.isLoading = false;
      }
    });
  }
}