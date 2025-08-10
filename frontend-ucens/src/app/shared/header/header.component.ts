import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  @ViewChild('institutionalBtn', { read: MatMenuTrigger }) instTrig!: MatMenuTrigger;
  @ViewChild('headquartersBtn', { read: MatMenuTrigger }) headquartersTrig!: MatMenuTrigger;
  @ViewChild('deptosBtn', { read: MatMenuTrigger }) deptosTrig!: MatMenuTrigger;

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
