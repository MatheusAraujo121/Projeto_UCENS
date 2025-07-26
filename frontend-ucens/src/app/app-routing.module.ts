import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StoryComponent } from './pages/institutional/story/story.component';
import { LoginComponent } from './pages/system/admin/login/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },   
  { path: 'story', component: StoryComponent },
  { path: 'login', component: LoginComponent }
   
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
