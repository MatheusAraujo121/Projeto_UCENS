import { Component, OnInit } from '@angular/core';
// Importe seu serviço de autenticação
import { AuthService } from 'src/app/services/auth/auth.service'; 

@Component({
  selector: 'app-dashboard', // Seletor do seu componente
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // ou .css
})
export class DashboardComponent implements OnInit {

  // 1. Declare a propriedade que faltava
  public isAdmin: boolean = false;

  // 2. Injete o AuthService no construtor
  constructor(private authService: AuthService) { }

  // 3. No ngOnInit (quando o componente carrega), 
  //    verifique o status do usuário
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

}