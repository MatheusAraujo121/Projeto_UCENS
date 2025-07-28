import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StoryComponent } from './pages/institutional/story/story.component';
import { LoginComponent } from './pages/system/admin/login/login.component';
import { DashboardComponent } from './pages/system/dashboard/dashboard.component';
import { ListAssociatesComponent } from './pages/system/associates/list-associates/list-associates.component';
import { CreateAssociatesComponent } from './pages/system/associates/create-associates/create-associates.component';
import { ViewAssociatesComponent } from './pages/system/associates/view-associates/view-associates.component';
import { ListDependentsComponent } from './pages/system/dependents/list-dependents/list-dependents.component';
import { CreateDependentsComponent } from './pages/system/dependents/create-dependents/create-dependents.component';

const routes: Routes = [
  //Rotas site expositivo
  { path: '', component: HomeComponent },   
  { path: 'story', component: StoryComponent },

  //Rotas Admin
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

  //Rotas Associados
  { path: 'list-associates', component: ListAssociatesComponent },
  { path: 'create-associates', component: CreateAssociatesComponent },
  { path: 'view-associates', component: ViewAssociatesComponent },

  //Rotas Dependentes
  { path: 'list-dependents', component: ListDependentsComponent },
  { path: 'create-dependents', component: CreateDependentsComponent }, 
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
