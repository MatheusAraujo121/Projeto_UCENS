import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';

//Header e Footer, Swipe e animações
import { SwiperModule } from 'swiper/angular';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Navbar
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule }    from '@angular/material/menu';
import { MatButtonModule }  from '@angular/material/button';
import { MatIconModule }    from '@angular/material/icon';

//Institutional
import { StoryComponent } from './pages/institutional/story/story.component';
import { StatuteComponent } from './pages/institutional/statute/statute.component';
import { RegulationsComponent } from './pages/institutional/regulations/regulations.component';
import { DirectorsComponent } from './pages/institutional/directors/directors.component';
import { ExPresidentsComponent } from './pages/institutional/ex-presidents/ex-presidents.component';
import { SocialHeadquarterComponent } from './pages/headquarters/social-headquarter/social-headquarter.component';
import { CountryHeadquarterIComponent } from './pages/headquarters/country-headquarter-i/country-headquarter-i.component';
import { CountryHeadquarterIIComponent } from './pages/headquarters/country-headquarter-ii/country-headquarter-ii.component';
import { SportyComponent } from './pages/departments/sporty/sporty.component';
import { CulturalComponent } from './pages/departments/cultural/cultural.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EventsComponent } from './pages/events/events.component';
import { LoginComponent } from './pages/system/admin/login/login.component';
import { EditComponent } from './pages/system/admin/edit/edit.component';
import { ViewComponent } from './pages/system/admin/view/view.component';

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
    ViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SwiperModule,
    BrowserAnimationsModule,
    MatToolbarModule, 
    MatMenuModule, 
    MatButtonModule, 
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
