import { Component, inject } from '@angular/core';
import { UploadComponent } from '../misc/upload/upload.component';
import { GlobalService } from '../service/global/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})

export class ImportComponent {
	globalService: GlobalService = inject(GlobalService);
	router: Router = inject(Router);
	constructor(){
		this.refresh();

	}
	currentPage=this.globalService.getCurrentPage();
	jsonData:any;
	refresh=()=>{
		this.globalService.getData(this.currentPage).subscribe(x=>{
			this.jsonData=JSON.stringify(x,null,3);
		});
	};
	post=(data:any)=>{
		let page=this.currentPage;
		console.log("page",page);
		console.log("data",data);
		this.globalService.excelHandler(data).then(x=>{
			console.log(x);
			this.globalService.postData(page,x).subscribe(x=>{
				this.jsonData=JSON.stringify(x,null,3);
				this.router.navigate(['/'+page]);
			})
		})
	};
	delete=(page:string)=>{
		let temp=confirm("delete ALL : "+page+" ?");
		console.log();
		if(temp===true)return this.globalService.wipeData(page).subscribe(x=>{
			this.refresh();
			this.router.navigate(['/'+page]);
		})
		return
	}
}
