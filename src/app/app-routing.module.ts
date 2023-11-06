import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {RouteConstant} from "./constant/route.constant";
import {HomeComponent} from "./component/home/home.component";
import {SearchComponent} from "./component/search/search.component";
import {ExploreComponent} from "./component/explore/explore.component";
import { DisplayGenreComponent } from './component/display-genre/display-genre.component';
import { DisplayArtistComponent } from './component/display-artist/display-artist.component';

const routes: Routes = [
  { path: RouteConstant.HOME, component: HomeComponent},
  { path: RouteConstant.SEARCH, component: SearchComponent},
  { path: RouteConstant.DISPLAYGENRE, component: DisplayGenreComponent},
  { path: RouteConstant.DISPLAYARTIST, component: DisplayArtistComponent},
  { path: RouteConstant.EXPLORE, component: ExploreComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
