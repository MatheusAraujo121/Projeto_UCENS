import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core'; 
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router'; 
import { Subscription } from 'rxjs'; 
import { filter } from 'rxjs/operators'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy { 
  isNavbarCollapsed = true;

  userName: string | null = null;
  userId: string | null = null;
  isAdmin: boolean = false;

  private routerSubscription!: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  @ViewChild('institutionalBtn', { read: MatMenuTrigger }) instTrig!: MatMenuTrigger;
  @ViewChild('headquartersBtn', { read: MatMenuTrigger }) headquartersTrig!: MatMenuTrigger;
  @ViewChild('deptosBtn', { read: MatMenuTrigger }) deptosTrig!: MatMenuTrigger;

  ngOnInit(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateUserInfo();
    });
    this.updateUserInfo();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateUserInfo(): void {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.userName = user.name; 
        this.userId = user.id;
        this.isAdmin = this.authService.isAdmin(); 
      }
    } else {
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
    this.updateUserInfo(); 
    this.closeNavbar();
  }

  viewProfile(): void {
    if (this.userId) {
      this.router.navigate(['/view-user', this.userId]);
      this.closeNavbar();
    }
  }
}