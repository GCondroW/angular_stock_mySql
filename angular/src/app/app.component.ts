import { Component, inject } from '@angular/core';
import { GlobalVar } from './globalVar';
import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	appRoutingModule : AppRoutingModule = inject(AppRoutingModule);
	dynamicRoutes=this.appRoutingModule.dynamicRoutes;
	constructor(){
		console.log("APP_BASE_HREF",inject(APP_BASE_HREF));
		GlobalVar.pages=this.dynamicRoutes;
	};
	ngOnInit() {

	};
	title = 'app_angular_jsonServer';
}