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

//Institucional
import { StoryComponent } from './pages/institucional/story/story.component';
import { StatuteComponent } from './pages/institucional/statute/statute.component';
import { RegulationsComponent } from './pages/institucional/regulations/regulations.component';
import { DirectorsComponent } from './pages/institucional/directors/directors.component';
import { ExPresidentsComponent } from './pages/institucional/ex-presidents/ex-presidents.component';
import { SedeSocialComponent } from './pages/sedes/sede-social/sede-social.component';
import { SedeCampestreIComponent } from './pages/sedes/sede-campestre-i/sede-campestre-i.component';
import { SedeCampestreIIComponent } from './pages/sedes/sede-campestre-ii/sede-campestre-ii.component';
import { EsportivoComponent } from './pages/departamentos/esportivo/esportivo.component';
import { CulturalComponent } from './pages/departamentos/cultural/cultural.component';
import { ContatoComponent } from './pages/contato/contato.component';
import { EventoComponent } from './pages/evento/evento.component';

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
    SedeSocialComponent,
    SedeCampestreIComponent,
    SedeCampestreIIComponent,
    EsportivoComponent,
    CulturalComponent,
    ContatoComponent,
    EventoComponent
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
