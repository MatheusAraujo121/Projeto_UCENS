import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    const email = this.form.value.email;
    const password = this.form.value.senha;

    this.authService.login(email, password).subscribe({
      next: token => {
        this.authService.setToken(token);
        this.loading = false;
        // navega para dashboard
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading = false;
        if (err.status === 401) {
          this.errorMessage = 'Credenciais inválidas';
        } else {
          this.errorMessage = 'Erro ao conectar com o servidor';
        }
      }
    });
  }
}
