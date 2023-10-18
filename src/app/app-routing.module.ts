import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RouteConstant} from "./constant/route.constant";
import {HomeComponent} from "./component/home/home.component";
import {SearchComponent} from "./component/search/search.component";

const routes: Routes = [
  { path: RouteConstant.HOME, component: HomeComponent},
  { path: RouteConstant.SEARCH, component: SearchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
