import { Component,OnInit,inject } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UploadComponent } from '../misc/upload/upload.component';
import { ColDef } from 'ag-grid-community';
import { XtService } from '../service/xt.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-xt',
  templateUrl: './xt.component.html',
  styleUrls: ['./xt.component.css']
})
export class XtComponent {
	public xtService:XtService=inject(XtService);
	private fileName:string="table_";
	public debugThis=()=>console.log(this);
	public gridData:Array<any>|null=null;
	ngOnInit(){
		
	};
	public colDefs:ColDef[]=[];
	public defaultColDef: ColDef = {
		resizable:true,
		sortable: true,
		filter: true,
		suppressMenu: true,
		suppressMovable:true,
		autoHeight: true,  
	};
	
	public gridOptions:any= {
		//rowData:null,
		suppressCellFocus:true,
		pagination: true,
		paginationAutoPageSize:false,	
		rowSelection: 'single',
		paginationPageSize:50,	
		accentedSort:true,
		onGridReady:(params:any)=>{
			console.log("grid Event => onGridReady : ");
			this.xtService.req.get("https://localhost:2125/xt/"+this.fileName).subscribe((x:any)=>{
				this.gridData=x[Object.keys(x)[0]];
				let header=Object.keys(this.gridData![0]);
				this.colDefs=header.map(x=>{return{field:x}})
				console.log(x);
			});
		},
		onFirstDataRendered:(event:any)=>{
			console.log("grid Event => onFirstDataRendered : ");
		},
		onSelectionChanged:(event: any)=>{

		},
		onCellEditingStarted:(event:any)=>{

		},
		onCellEditingStopped:(event:any)=>{

		},
		onPaginationChanged:(params:any)=>{
			//console.log("grid Event => onPaginationChanged : ");
		},
		onRowDataUpdated:async(event:any)=>{
			console.log("grid Event => onRowDataUpdated : ");
		},
		onFilterChanged:(event:any)=>{
			//console.log("grid Event => onFilterChanged : ");
		},
		onColumnResized: (event:any) => {
			console.log("grid Event => onColumnResized : ");
		},
		onModelUpdated: (event:any)=>{
			//Displayed rows have changed. Triggered after sort, filter or tree expand / collapse events.
			console.log("grid Event => onModelUpdated : ",event);
		},
		onComponentStateChanged:(event:any)=>{
			console.log("grid Event => onComponentStateChanged : ");
		},
		onColumnVisible:(event:any)=>{
			console.log("grid Event => onColumnVisible : ",event);
		},
		onRowDoubleClicked:(event:any)=>{

		}
	};
	
	private offcanvasService:NgbOffcanvas=inject(NgbOffcanvas);
	private offCanvasInstance:any;
	public _offCanvas={
		open:(content:any)=>this.offCanvasInstance=this.offcanvasService.open(content),
	};
	
	public excel={
		upload:(dbName:string,data:any)=>{
			this.xtService.excelHandler.toJson(data).then(x=>{
				this.xtService.req.post("https://localhost:2125/xt/"+this.fileName,x).subscribe((x:any)=>{
					window.location.reload();
				})
			});	
		}
	};
	
	public filter:any={
		searchTimeout:undefined,
		searchDelay:300,
		search:(event:any)=>{
			if(!!this.filter.searchTimeout)clearTimeout(this.filter.searchTimeout);
			this.filter.searchTimeout=setTimeout(()=>{
				this.gridOptions.api.setQuickFilter(event.target.value);
			},this.filter.searchDelay);	
		},
	};

}
