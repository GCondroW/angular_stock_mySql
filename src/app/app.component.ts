import { Component, inject } from '@angular/core';
import { GlobalService } from './service/global/global.service';
import { GlobalVar } from './globalVar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	globalService = inject(GlobalService);
	excelDb = GlobalVar.excelDb;
	tableNames:any=[];
	sheetNames:any=[];
	posts:any="";
	constructor(){
		this.globalService.getData().subscribe(
			(response) => {
				this.excelDb.data = response;
				this.excelDb.tableNames = Object.keys(response);
				this.excelDb.sheetNames = this.globalService.getSheetNames(response);
				this.posts=JSON.stringify(GlobalVar);
				console.log(GlobalVar);
			},
			(error) => { console.log(error); });
	};
	ngOnInit() {
	
	};
	title = 'app_angular_jsonServer';
}