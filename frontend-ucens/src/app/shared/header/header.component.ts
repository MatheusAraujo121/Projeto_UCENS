import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core'; // Adiciona OnInit, OnDestroy
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router'; // Adiciona NavigationEnd
import { Subscription } from 'rxjs'; // Adiciona Subscription
import { filter } from 'rxjs/operators'; // Adiciona filter

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy { // Implementa OnInit, OnDestroy
  isNavbarCollapsed = true;

  // Propriedades para dados do usuário
  userName: string | null = null;
  userId: string | null = null;
  isAdmin: boolean = false;

  private routerSubscription!: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  @ViewChild('institutionalBtn', { read: MatMenuTrigger }) instTrig!: MatMenuTrigger;
  @ViewChild('headquartersBtn', { read: MatMenuTrigger }) headquartersTrig!: MatMenuTrigger;
  @ViewChild('deptosBtn', { read: MatMenuTrigger }) deptosTrig!: MatMenuTrigger;

  ngOnInit(): void {
    // Atualiza as informações do usuário sempre que a navegação for concluída
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateUserInfo();
    });
    // Garante que as informações sejam carregadas na inicialização
    this.updateUserInfo();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * Atualiza as informações do usuário logado (nome, id, status de admin)
   */
  private updateUserInfo(): void {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.userName = user.name; // O 'name' aqui é o 'UserName' do token
        this.userId = user.id;
        this.isAdmin = this.authService.isAdmin(); // Pergunta ao serviço se é admin
      }
    } else {
      // Limpa os dados se não estiver logado
      this.userName = null;
      this.userId = null;
      this.isAdmin = false;
    }
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  closeNavbar() {
    this.isNavbarCollapsed = true;
  }

  logout() {
    this.authService.logout();
    this.updateUserInfo(); // Atualiza a UI imediatamente após o logout
    this.closeNavbar();
  }

  /**
   * Navega para a tela de visualização do perfil do usuário logado.
   */
  viewProfile(): void {
    if (this.userId) {
      this.router.navigate(['/view-user', this.userId]);
      this.closeNavbar();
    }
  }
}