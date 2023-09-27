import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RouteConstant} from "./constant/route.constant";
import {ResultatTemplateComponent} from "./component/resultat-template/resultat-template.component";

const routes: Routes = [
  { path: RouteConstant.HOME, component: ResultatTemplateComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
