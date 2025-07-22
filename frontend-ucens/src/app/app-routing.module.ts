import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StoryComponent } from './pages/institucional/story/story.component';

const routes: Routes = [
  { path: '', component: HomeComponent },   
  { path: 'story', component: StoryComponent }
   
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
