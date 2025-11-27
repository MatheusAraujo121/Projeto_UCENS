import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User, UserUpdate } from 'src/app/services/user/user.interface';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  userForm!: FormGroup;
  userId!: string; 
  isLoading: boolean = true;
  isAdmin: boolean = false;
  isOwner: boolean = false; 
  originalUserName: string = ''; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    const currentUserId = this.authService.getUserId();

    if (!idFromRoute || !currentUserId) {
      this.handleAuthError('Não foi possível identificar o usuário.');
      return;
    }
    
    this.userId = idFromRoute;
    this.isAdmin = this.authService.isAdmin();
    this.isOwner = currentUserId === this.userId;

    if (!this.isAdmin && !this.isOwner) {
      this.handleAuthError('Você não tem permissão para editar este perfil.');
      return;
    }
    
    this.initForm();
    this.loadUserData();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(100)]], 
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      senha: ['', [Validators.minLength(6)]], 
      confirmarSenha: ['']
    }, {
      validators: CustomValidators.passwordMatchValidator('senha', 'confirmarSenha')
    });

    this.userForm.get('senha')?.valueChanges.subscribe(value => {
      const confirmarSenhaControl = this.userForm.get('confirmarSenha');
      if (value && value.length > 0) {
        confirmarSenhaControl?.setValidators([Validators.required]);
      } else {
        confirmarSenhaControl?.clearValidators();
      }
      confirmarSenhaControl?.updateValueAndValidity();
    });
  }

  private loadUserData(): void {
    this.isLoading = true;
    this.userService.getUser(this.userId).subscribe(
      (user) => {
        this.originalUserName = user.userName; 
        this.userForm.patchValue({
          userName: user.userName,
          email: user.email
        });
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Falha ao carregar dados do usuário.', 'Fechar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
        this.router.navigate(['/dashboard']); 
      }
    );
  }

  private handleAuthError(message: string): void {
    this.isLoading = false;
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios e corrija os erros.', 'Fechar', { duration: 3000 });
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.userForm.getRawValue(); 

    const userUpdate: UserUpdate = {
      userName: formValue.userName,
      email: formValue.email
    };

    if (formValue.senha && formValue.senha.trim() !== '') {
      userUpdate.senha = formValue.senha;
    }

    this.userService.updateUser(this.userId, userUpdate).subscribe({
      next: () => {
        this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        
        if (this.isOwner) {
          this.snackBar.open('Suas informações foram atualizadas. Por favor, faça login novamente.', 'OK', {
            duration: 7000,
            panelClass: ['snackbar-info']
          });
          this.authService.logout(); 
        } else {
          this.router.navigate(['/view-user', this.userId]);
        }
      },
      error: (error) => {
        this.isLoading = false; 
        console.error('Erro ao atualizar usuário:', error);
        const errorMessage = error.error?.message || 'Falha ao atualizar usuário. Verifique se o nome/e-mail já está em uso.';
        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}