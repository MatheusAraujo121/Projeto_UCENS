import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user/user.service';
import { UserCreate } from 'src/app/services/user/user.interface';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  userForm!: FormGroup;
  isLoading = false;
  hidePassword = true;        
  hideConfirmPassword = true;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(100)]], 
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, {
      validators: CustomValidators.passwordMatchValidator('senha', 'confirmarSenha')
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios e corrija os erros.', 'Fechar', { duration: 3000 });
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true; 
    const { userName, email, senha } = this.userForm.value;
    const newUser: UserCreate = { userName, email, senha };

    this.userService.createUser(newUser).subscribe({
      next: () => {
        this.snackBar.open('Usuário criado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/list-users']);
      },
      error: (error) => {
        this.isLoading = false; 
        console.error('Erro ao criar usuário:', error);
        const errorMessage = error.error?.message || 'Falha ao criar usuário. Verifique se o nome/e-mail já está em uso.';
        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
