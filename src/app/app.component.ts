import { Component, inject } from '@angular/core';
import { GlobalService } from './service/global/global.service';
import { GlobalVar } from './globalVar';
import { AppRoutingModule } from './app-routing.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	globalService : GlobalService = inject(GlobalService);
	appRoutingModule : AppRoutingModule = inject(AppRoutingModule);
	dynamicRoutes=this.appRoutingModule.dynamicRoutes;
	constructor(){
		GlobalVar.pages=this.dynamicRoutes;
	};
	ngOnInit() {

	};
	title = 'app_angular_jsonServer';
}