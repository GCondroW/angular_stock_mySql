import { Component,OnInit,inject } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UploadComponent } from '../misc/upload/upload.component';
import { DataTableComponent } from '../misc/data-table/data-table.component';
import { GlobalService } from '../service/global/global.service';
import { GlobalVar } from '../globalVar'
import { DynamicTableComponent } from '../misc/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {
	private globalService:GlobalService=inject(GlobalService);
	public currentPage=this.globalService.getCurrentPage();
	public downloadExcel = this.globalService.downloadExcel;
	public JSON=JSON;
	public Object=Object;
	constructor(){
		console.log(this);
	};
	ngOnInit(){
		this.get(this.currentPage);
	};
	
	/// OFFCANVAS ///
	private offcanvasService:NgbOffcanvas=inject(NgbOffcanvas);
	public _offCanvas={
		open:(content:any)=>this.offcanvasService.open(content),
	};
	/// OFFCANVAS ///
	
	/// excel handler ///
	public _excel={
		postExcel:(dbName:string,data:any)=>{
			//this.isLoaded=false;	
			this.globalService.excelHandler(data).then(x=>{
				let api1=this.globalService.postData(dbName,x);
				api1.subscribe(x=>this.data=x);
			});
		},
		downloadExcel:this.globalService.downloadExcel,
	};
	/// excel handler ///
	public data:any;
	get=(page:string)=>{
		return this.globalService.getData(page,undefined).subscribe(x=>this.data=x);
	};
	public updateTable=(x:any)=>{
		console.log('updateTablePlaceHolder');
	};
	public refresh=()=>{
		console.log('refreshPlaceHolder');
	};

}
