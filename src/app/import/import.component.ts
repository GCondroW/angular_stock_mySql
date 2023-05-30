import { Component, inject } from '@angular/core';
import { UploadComponent } from '../misc/upload/upload.component';
import { DataTableComponent } from '../misc/data-table/data-table.component';
import { GlobalService } from '../service/global/global.service';


@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css',]
})

export class ImportComponent {
	private globalService: GlobalService = inject(GlobalService);
	
	public currentPage:string;
	public jsonData:any;
	
	constructor(){
		this.currentPage=this.globalService.getCurrentPage();
		this.refresh();
	};

	refresh=()=>{
		this.get(this.currentPage);
	};
	updateTable=(data:any)=>{
		let dataIsEmpty=!!(Object.keys(data).length<1);
		if(dataIsEmpty)return this.jsonData=null;
		return this.jsonData=JSON.stringify(data,null,3);
	};
	get=(page:string)=>{
		this.globalService.getData(page).subscribe(x=>{
			this.updateTable(x);
		});
	};
	post=(page:string,data:any)=>{
		console.log("page",page);
		console.log("data",data);
		this.globalService.excelHandler(data).then(x=>{
			console.log(x);
			this.globalService.postData(page,x).subscribe(x=>{
				this.updateTable(x);
			})
		})
	};
	deleteAll=(page:string)=>{
		let temp=confirm("delete ALL : "+page+" ?");
		console.log();
		if(temp===true)return this.globalService.wipeData(page).subscribe(x=>{
			this.updateTable(x);
		})
		return
	};
	put=()=>{
	
	};

}
