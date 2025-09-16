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
import { StatuteComponent } from './pages/institutional/statute/statute.component';
import { RegulationsComponent } from './pages/institutional/regulations/regulations.component';
import { DirectorsComponent } from './pages/institutional/directors/directors.component';
import { CulturalComponent } from './pages/departments/cultural/cultural.component';
import { EventsComponent } from './pages/events/events.component';
import { EditAssociatesComponent } from './pages/system/associates/edit-associates/edit-associates.component';
import { ViewDependentsComponent } from './pages/system/dependents/view-dependents/view-dependents.component';
import { EditDependentsComponent } from './pages/system/dependents/edit-dependents/edit-dependents.component';
import { ListActivitiesComponent } from './pages/system/activities/list-activities/list-activities.component';
import { CreateActivityComponent } from './pages/system/activities/create-activity/create-activity.component';
import { ViewActivityComponent } from './pages/system/activities/view-activity/view-activity.component';
import { EditActivityComponent } from './pages/system/activities/edit-activity/edit-activity.component';
import { SportyComponent } from './pages/departments/sporty/sporty.component';
import { CreateEventComponent } from './pages/system/events/create-event/create-event.component';
import { EditEventComponent } from './pages/system/events/edit-event/edit-event.component';
import { ViewSportyComponent } from './pages/departments/view-sporty/view-sporty.component';
import { ViewCulturalComponent } from './pages/departments/view-cultural/view-cultural.component';
import { ListEventsComponent } from './pages/system/events/list-events/list-events.component';
import { ViewEventComponent } from './pages/system/events/view-event/view-event.component';
import { EventInfoComponent } from './pages/events/event-info/event-info.component';

const routes: Routes = [
  //Rotas site expositivo
  { path: '', component: HomeComponent },
  { path: 'story', component: StoryComponent },
  { path: 'statute', component: StatuteComponent },
  { path: 'regulations', component: RegulationsComponent },
  { path: 'directors', component: DirectorsComponent },
  { path: 'departments/sporty', component: SportyComponent },
  { path: 'departments/view-sporty/:id', component: ViewSportyComponent },
  { path: 'departments/cultural', component: CulturalComponent },
  { path: 'departments/view-cultural/:id', component: ViewCulturalComponent },
  { path: 'events', component: EventsComponent },

  //Rotas Admin
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

  //Rotas Associados
  { path: 'list-associates', component: ListAssociatesComponent },
  { path: 'create-associates', component: CreateAssociatesComponent },
  { path: 'view-associates/:id', component: ViewAssociatesComponent },
  { path: 'edit-associates/:id', component: EditAssociatesComponent },

  //Rotas Dependentes
  { path: 'list-dependents', component: ListDependentsComponent },
  { path: 'create-dependents', component: CreateDependentsComponent },
  { path: 'view-dependents/:id', component: ViewDependentsComponent },
  { path: 'edit-dependents/:id', component: EditDependentsComponent },

  //Rotas Atividades
  { path: 'list-activities', component: ListActivitiesComponent },
  { path: 'create-activity', component: CreateActivityComponent },
  { path: 'view-activity/:id', component: ViewActivityComponent },
  { path: 'edit-activity/:id', component: EditActivityComponent },

  //Rotas Eventos 
  { path: 'list-events', component: ListEventsComponent }, 
  { path: 'create-event', component: CreateEventComponent },
  { path: 'view-event/:id', component: ViewEventComponent }, 
  { path: 'edit-event/:id', component: EditEventComponent },
  { path: 'event-info/:id', component: EventInfoComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
