import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResultatTemplateComponent } from './component/resultat-template/resultat-template.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { HomeComponent } from './component/home/home.component';
import {NgOptimizedImage} from "@angular/common";
import { SearchComponent } from './component/search/search.component';
import { ExploreComponent } from './component/explore/explore.component';
import { DisplayGenreComponent } from './component/display-genre/display-genre.component';
import { DisplayArtistComponent } from './component/display-artist/display-artist.component';
import { DisplayLatestReleaseComponent } from './component/display-latest-release/display-latest-release.component';

@NgModule({
  declarations: [
    AppComponent,
    ResultatTemplateComponent,
    NavbarComponent,
    HomeComponent,
    SearchComponent,
    ExploreComponent,
    DisplayGenreComponent,
    DisplayArtistComponent,
    DisplayLatestReleaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
