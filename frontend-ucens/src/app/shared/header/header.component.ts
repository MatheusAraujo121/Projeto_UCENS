import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // Certifique-se que o SCSS está correto
})
export class HeaderComponent {
  isNavbarCollapsed = true; // Propriedade para controlar o estado

  constructor(public authService: AuthService, private router: Router) {}

  @ViewChild('institutionalBtn', { read: MatMenuTrigger }) instTrig!: MatMenuTrigger;
  @ViewChild('headquartersBtn', { read: MatMenuTrigger }) headquartersTrig!: MatMenuTrigger;
  @ViewChild('deptosBtn', { read: MatMenuTrigger }) deptosTrig!: MatMenuTrigger;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  // Método para fechar o menu ao clicar em um item (opcional, mas bom para UX)
  closeNavbar() {
    this.isNavbarCollapsed = true;
  }

  logout() {
    this.authService.logout();
    this.closeNavbar(); // Fecha o menu ao deslogar
  }
}