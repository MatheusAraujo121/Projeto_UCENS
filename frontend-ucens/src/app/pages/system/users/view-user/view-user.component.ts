import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/services/user/user.interface';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  user: User | null = null;
  isLoading: boolean = true;
  isAdmin: boolean = false;
  isOwner: boolean = false; // Flag para verificar se é o dono do perfil

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const userIdFromRoute = this.route.snapshot.paramMap.get('id');
    const currentUserId = this.authService.getUserId();
    
    if (!userIdFromRoute || !currentUserId) {
      this.handleError('ID do usuário ou usuário logado não encontrado.');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.isAdmin = this.authService.isAdmin();
    this.isOwner = currentUserId === userIdFromRoute;

    // --- LÓGICA DE PERMISSÃO ---
    // (Admin pode ver todos, Usuário pode ver apenas a si mesmo)
    if (!this.isAdmin && !this.isOwner) {
      this.handleError('Você não tem permissão para visualizar este perfil.');
      this.isLoading = false;
      this.user = null; // Garante que o template de erro seja exibido
      return;
    }

    // Se passou, carrega os dados
    this.loadUserProfile(userIdFromRoute);
  }

  loadUserProfile(id: string): void {
    this.isLoading = true;
    this.userService.getUser(id).subscribe(
      (data) => {
        this.user = data;
        this.isLoading = false;
      },
      (error) => {
        this.handleError('Falha ao carregar o perfil do usuário.');
        this.isLoading = false;
      }
    );
  }

  private handleError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }
}