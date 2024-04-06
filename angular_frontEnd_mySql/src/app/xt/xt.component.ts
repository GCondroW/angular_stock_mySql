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
	public fileName:string="table_";
	public debugThis=()=>console.log(this);
	public gridData:Array<any>|null=null;
	public userName:string="";
	public apiUrl:string="";
	public setUserName=()=>{
		let person = prompt();
		if (person != null) {
			alert(person)
			let temp=JSON.parse(localStorage.getItem("xt")!);
			temp.userName=person;
			localStorage.setItem("xt",JSON.stringify(temp));
			this.userName=temp.userName;
			return temp.userName;
		} 
	};
	public pUser=["guest42","utn5758"];
	public isP=()=>this.pUser.findIndex(x=>x==this.userName)+1;
	
	
	ngOnInit(){
		
		let url=()=>{
			if(location.host==="localhost:4200")return "https://localhost:2125/xt/"+this.fileName;
			return "https://cwtest.biz.id/xt/"+this.fileName;
		};
		let userName=()=>{
			if(!localStorage.getItem("xt")){
				localStorage.setItem("xt",JSON.stringify({userName:'guest'}));
				let xt=JSON.parse(localStorage.getItem("xt")!);
				return xt.userName;
			}else{
				let xt=JSON.parse(localStorage.getItem("xt")!);
				return xt.userName;
			}
			
		};
		this.apiUrl=url();
		this.userName=userName();
		console.log(userName());
	};
	
	public getTableHeight = () =>{
		let windowHeigth=window.innerHeight;
		let navBarHeight=document.getElementById("mainNavbar")!.clientHeight;
		let offset=15;
		let tableHeight=windowHeigth-(navBarHeight+offset);
		this.tableHeight=tableHeight;
		return tableHeight;
	};
	public tableHeight:number=700;
	
	public colDefs:ColDef[]=[];
	public defaultColDef: ColDef = {
		resizable:true,
		sortable: true,
		filter: true,
		suppressMenu: false,
		suppressMovable:false,
		autoHeight: true,  
	};
	
	public gridOptions:any= {
		//rowData:null,
		suppressCellFocus:false,
		pagination: false,
		paginationAutoPageSize:false,	
		rowSelection: 'single',
		paginationPageSize:50,	
		accentedSort:true,
		onGridReady:(params:any)=>{
			console.log("grid Event => onGridReady : ");
			this.xtService.req.get(this.apiUrl).subscribe((x:any)=>{
				console.log(x);
				if(x===null){
					alert ("tabel kosong");
					this.gridData=[]
				}else{
					this.gridData=x[Object.keys(x)[0]];
					let header=Object.keys(this.gridData![0]);
					this.colDefs=header.map(x=>{return{field:x}})
					
				};
			});
			addEventListener("resize", (event) => {
				this.getTableHeight();
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
			this.gridOptions.columnApi.autoSizeAllColumns()
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
				this.xtService.req.post(this.apiUrl,x).subscribe((x:any)=>{
					window.location.reload();
				})
			});	
		},
		download:(data:any,fileName:string)=>{
			this.xtService.excelHandler.toExcel(data,fileName)
		},
		delete:()=>{
			this.xtService.req.delete(this.apiUrl).subscribe((x:any)=>{
				console.log("delete",x);
				window.location.reload();
			})
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
