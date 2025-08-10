import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

//Header e Footer, Swipe e animações
import { SwiperModule } from 'swiper/angular';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Angular material
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';

//Institutional
import { StoryComponent } from './pages/institutional/story/story.component';
import { StatuteComponent } from './pages/institutional/statute/statute.component';
import { RegulationsComponent } from './pages/institutional/regulations/regulations.component';
import { DirectorsComponent } from './pages/institutional/directors/directors.component';
import { ExPresidentsComponent } from './pages/institutional/ex-presidents/ex-presidents.component';

//Sedes
import { SocialHeadquarterComponent } from './pages/headquarters/social-headquarter/social-headquarter.component';
import { CountryHeadquarterIComponent } from './pages/headquarters/country-headquarter-i/country-headquarter-i.component';
import { CountryHeadquarterIIComponent } from './pages/headquarters/country-headquarter-ii/country-headquarter-ii.component';

//Departamentos
import { SportyComponent } from './pages/departments/sporty/sporty.component';
import { CulturalComponent } from './pages/departments/cultural/cultural.component';

//Contato
import { ContactComponent } from './pages/contact/contact.component';

//Eventos
import { EventsComponent } from './pages/events/events.component';

//Admin
import { LoginComponent } from './pages/system/admin/login/login.component';
import { EditComponent } from './pages/system/admin/edit/edit.component';
import { ViewComponent } from './pages/system/admin/view/view.component';

//Dashboard
import { DashboardComponent } from './pages/system/dashboard/dashboard.component';
import { ListAssociatesComponent } from './pages/system/associates/list-associates/list-associates.component';
import { EditAssociatesComponent } from './pages/system/associates/edit-associates/edit-associates.component';
import { ViewAssociatesComponent } from './pages/system/associates/view-associates/view-associates.component';
import { CreateAssociatesComponent } from './pages/system/associates/create-associates/create-associates.component';

//Mascara de input
import { NgxMaskModule } from 'ngx-mask';
import { ListDependentsComponent } from './pages/system/dependents/list-dependents/list-dependents.component';
import { CreateDependentsComponent } from './pages/system/dependents/create-dependents/create-dependents.component';
import { EditDependentsComponent } from './pages/system/dependents/edit-dependents/edit-dependents.component';
import { ViewDependentsComponent } from './pages/system/dependents/view-dependents/view-dependents.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    StoryComponent,
    StatuteComponent,
    RegulationsComponent,
    DirectorsComponent,
    ExPresidentsComponent,
    SocialHeadquarterComponent,
    CountryHeadquarterIComponent,
    CountryHeadquarterIIComponent,
    SportyComponent,
    CulturalComponent,
    ContactComponent,
    EventsComponent,
    LoginComponent,
    EditComponent,
    ViewComponent,
    DashboardComponent,
    ListAssociatesComponent,
    EditAssociatesComponent,
    ViewAssociatesComponent,
    CreateAssociatesComponent,
    ListDependentsComponent,
    CreateDependentsComponent,
    EditDependentsComponent,
    ViewDependentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SwiperModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatGridListModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    MatDividerModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: MatPaginatorIntl,
      useFactory: () => {
        const paginatorIntl = new MatPaginatorIntl();
        paginatorIntl.itemsPerPageLabel = 'Itens por página';
        paginatorIntl.nextPageLabel = 'Próxima página';
        paginatorIntl.previousPageLabel = 'Página anterior';
        paginatorIntl.firstPageLabel = 'Primeira página';
        paginatorIntl.lastPageLabel = 'Última página';
        paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
          if (length === 0 || pageSize === 0) {
            return `0 de ${length}`;
          }
          const startIndex = page * pageSize;
          const endIndex = Math.min(startIndex + pageSize, length);
          return `${startIndex + 1} - ${endIndex} de ${length}`;
        };
        return paginatorIntl;
      }
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
