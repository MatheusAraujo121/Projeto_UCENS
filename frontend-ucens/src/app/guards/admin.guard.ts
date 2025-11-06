import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Usuário deve estar logado E ser admin (baseado no nome de usuário)
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    }

    // Se não for admin, redireciona para o dashboard
    this.snackBar.open('Acesso negado - Rota exclusiva para Administradores.', 'Fechar', { duration: 3000 });
    this.router.navigate(['/dashboard']);
    return false;
  }
}