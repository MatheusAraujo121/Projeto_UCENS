

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
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]] 
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.remainingAttempts = null;

    
    
    const credentials = {
      Email: this.loginForm.value.email,
      Senha: this.loginForm.value.password
    };
    

    
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
