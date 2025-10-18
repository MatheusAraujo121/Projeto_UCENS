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
import { SocialHeadquarterComponent } from './pages/headquarters/social-headquarter/social-headquarter.component';
import { CountryHeadquarterIComponent } from './pages/headquarters/country-headquarter-i/country-headquarter-i.component';
import { CountryHeadquarterIIComponent } from './pages/headquarters/country-headquarter-ii/country-headquarter-ii.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ExPresidentsComponent } from './pages/institutional/ex-presidents/ex-presidents.component';
import { CreateClassComponent } from './pages/system/classes/create-class/create-class.component';
import { ViewClassComponent } from './pages/system/classes/view-class/view-class.component';
import { EditClassComponent } from './pages/system/classes/edit-class/edit-class.component';
import { AuthGuard } from './guards/auth.guard';
import { FinancialDashboardComponent } from './pages/system/financial/financial-dashboard/financial-dashboard.component';
import { GenerateBoletoComponent } from './pages/system/financial/generate-boleto/generate-boleto.component';
import { PaymentHistoryComponent } from './pages/system/financial/payment-history/payment-history.component';
import { BoletoDetailComponent } from './pages/system/financial/boleto-detail/boleto-detail.component';
import { ListSuppliersComponent } from './pages/system/suppliers/list-suppliers/list-suppliers.component';
import { CreateSuppliersComponent } from './pages/system/suppliers/create-suppliers/create-suppliers.component';
import { EditSuppliersComponent } from './pages/system/suppliers/edit-suppliers/edit-suppliers.component';
import { ViewSuppliersComponent } from './pages/system/suppliers/view-suppliers/view-suppliers.component';
import { ExpensesDashboardComponent } from './pages/system/expenses/expenses-dashboard/expenses-dashboard.component';
import { CreateExpenseComponent } from './pages/system/expenses/create-expense/create-expense.component';
import { ExpenseDetailComponent } from './pages/system/expenses/expense-detail/expense-detail.component';
import { EditExpenseComponent } from './pages/system/expenses/edit-expense/edit-expense.component';

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
  { path: 'headquarter/social', component: SocialHeadquarterComponent },
  { path: 'headquarter/campestre1', component: CountryHeadquarterIComponent },
  { path: 'headquarter/campestre2', component: CountryHeadquarterIIComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'ex-presidents', component: ExPresidentsComponent },

  //Rotas Admin
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  //Rotas Associados
  { path: 'list-associates', component: ListAssociatesComponent, canActivate: [AuthGuard] },
  { path: 'create-associates', component: CreateAssociatesComponent, canActivate: [AuthGuard] },
  { path: 'view-associates/:id', component: ViewAssociatesComponent, canActivate: [AuthGuard] },
  { path: 'edit-associates/:id', component: EditAssociatesComponent, canActivate: [AuthGuard] },

  //Rotas Dependentes
  { path: 'list-dependents', component: ListDependentsComponent, canActivate: [AuthGuard] },
  { path: 'create-dependents', component: CreateDependentsComponent, canActivate: [AuthGuard] },
  { path: 'view-dependents/:id', component: ViewDependentsComponent, canActivate: [AuthGuard] },
  { path: 'edit-dependents/:id', component: EditDependentsComponent, canActivate: [AuthGuard] },

  //Rotas Atividades
  { path: 'list-activities', component: ListActivitiesComponent, canActivate: [AuthGuard] },
  { path: 'create-activity', component: CreateActivityComponent, canActivate: [AuthGuard] },
  { path: 'view-activity/:id', component: ViewActivityComponent, canActivate: [AuthGuard] },
  { path: 'edit-activity/:id', component: EditActivityComponent, canActivate: [AuthGuard] },

  //Rotas Eventos 
  { path: 'list-events', component: ListEventsComponent, canActivate: [AuthGuard] },
  { path: 'create-event', component: CreateEventComponent, canActivate: [AuthGuard] },
  { path: 'view-event/:id', component: ViewEventComponent, canActivate: [AuthGuard] },
  { path: 'edit-event/:id', component: EditEventComponent, canActivate: [AuthGuard] },
  { path: 'event-info/:id', component: EventInfoComponent },

  //Rotas Turmas
  { path: 'create-class/:id', component: CreateClassComponent, canActivate: [AuthGuard] },
  { path: 'view-class/:id', component: ViewClassComponent, canActivate: [AuthGuard] },
  { path: 'edit-class/:id', component: EditClassComponent, canActivate: [AuthGuard] },

  // Rotas Financeiro
  { path: 'financial-dashboard', component: FinancialDashboardComponent, canActivate: [AuthGuard] },
  { path: 'generate-boleto', component: GenerateBoletoComponent, canActivate: [AuthGuard] },
  { path: 'payment-history/:associadoId', component: PaymentHistoryComponent, canActivate: [AuthGuard] },
  { path: 'boleto-detail/:boletoId', component: BoletoDetailComponent, canActivate: [AuthGuard] },

  //Rotas fornecedores
  { path: 'list-suppliers', component: ListSuppliersComponent, canActivate: [AuthGuard] },
  { path: 'create-suppliers', component: CreateSuppliersComponent, canActivate: [AuthGuard] },
  { path: 'edit-suppliers/:id', component: EditSuppliersComponent, canActivate: [AuthGuard] },
  { path: 'view-suppliers/:id', component: ViewSuppliersComponent, canActivate: [AuthGuard] },

  //Rotas Despesas
    { path: 'list-expenses', component: ExpensesDashboardComponent, canActivate: [AuthGuard] },
    { path: 'create-expense', component: CreateExpenseComponent, canActivate: [AuthGuard] },
    { path: 'expense-detail/id', component: ExpenseDetailComponent, canActivate: [AuthGuard] },
    { path: 'edit-expense/:id', component: EditExpenseComponent, canActivate: [AuthGuard] },
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }