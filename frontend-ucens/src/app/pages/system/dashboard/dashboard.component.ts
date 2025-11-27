import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth/auth.service'; 

@Component({
  selector: 'app-dashboard', 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] 
})
export class DashboardComponent implements OnInit {

  public isAdmin: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

}