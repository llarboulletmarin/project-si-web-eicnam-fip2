import { Component } from '@angular/core';
import {RouteConstant} from "../../constant/route.constant";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  protected readonly RouteConstant = RouteConstant;
}
