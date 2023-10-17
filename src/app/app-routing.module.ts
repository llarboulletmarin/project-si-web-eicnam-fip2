import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RouteConstant} from "./constant/route.constant";
import {HomeComponent} from "./component/home/home.component";

const routes: Routes = [
  { path: RouteConstant.HOME, component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
