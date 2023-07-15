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
	excelDb = GlobalVar.excelDb;
	tableNames:any=[];
	sheetNames:any=[];
	pages:any="";
	
	constructor(){
		this.pages=this.dynamicRoutes;
		/*this.globalService.getData(this.globalService.getCurrentPage()).subscribe(
			(response) => {
				this.excelDb.data = response;
				this.excelDb.tableNames = Object.keys(response);
				this.excelDb.sheetNames = this.globalService.getSheetNames(response);
				console.log(GlobalVar);
			},
			(error) => { console.log(error); });*/
	};
	ngOnInit() {
		console.log(this.dynamicRoutes);
	};
	title = 'app_angular_jsonServer';
}