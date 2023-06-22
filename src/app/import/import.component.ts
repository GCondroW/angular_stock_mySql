import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { UploadComponent } from '../misc/upload/upload.component';
import { DataTableComponent } from '../misc/data-table/data-table.component';
import { GlobalService } from '../service/global/global.service';
import { GlobalVar } from '../globalVar'
import { ColDef } from 'ag-grid-community';

import { DynamicModalComponent } from '../misc/dynamic-modal/dynamic-modal.component';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css',]
})

export class ImportComponent {
	private globalService: GlobalService = inject(GlobalService);
	private globalVar = GlobalVar;
	private consoleDump = GlobalVar.consoleDump;
	public downloadExcel = this.globalService.downloadExcel;
	public testModal=this.globalService._modal.createModal;
	
	constructor(){
		this.currentPage=this.globalService.getCurrentPage();
		this.message=this.globalVar.import.message;
		this.navInit();
		this.refresh();
	};
	ngOnInit(){
		
	};

	public message:any;
	public errMessage:any;
	public currentPage:string;//current page / database used => import
	public isLoaded:boolean=false;//loading placeholder
	public dataIsNotEmpty:boolean=false;//empty data placeholder
	public selectedDataId:number=-1;//self explanatory, for 'precision usage'
	private selectedRowId:number | null=null;//self explanatory, for 'precision usage'
	private selectedColId:string="";//self explanatory, for 'precision usage'
	private updateDataOld:any;
	private updateDataNew:any;
	private tableColumn:Array<any>=this.globalVar.import.tableColumn;
	
	public testFunct=()=>{
		this.consoleDump([
			["navStates",this.navStates],
			["DynamicModalComponent",DynamicModalComponent],
		]);
		//this.downloadExcel(this.currentPage);
		console.log(this)
	}
	
	/// MODAL HANDLER ///
	
	private modalService:NgbModal=inject(NgbModal);
	public closeModal=()=>{
		this.modalService.dismissAll();
	}
	@ViewChild("ABC") aaa!:DynamicModalComponent;

	closeResult:string="";
	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
	
	/// MODAL HANDLER ///
	
	
	/// NAV HANDLER ///
	private navInit=()=>{
		this.navStates.map(item=>{
			if(item.default===true){
				this.activeNav=item.name;
				item.funct();
			};
			return
		})
	}
	public activeNav:any;
	public navStates:Array<any>=[
		{
			default:true,
			name:"Daftar",
			funct:()=>{
				this.defaultColDef={
					resizable:true,
					sortable: true,
					filter: true,
					editable:false,
				};
				this.gridOptions.onRowClicked= () => {
					console.log("row clicked disabled for "+this.activeNav);
				},
				this.activeNav="Daftar";
			},
		},
		{
			name:"Edit",
			funct:()=>{
				this.defaultColDef={
					resizable:true,
					sortable: true,
					filter: true,
					editable:true,
				};
				this.gridOptions.onRowClicked= (event:any) => {
					console.log("row clicked",event);

				},
				this.activeNav="Edit";
			},
		},
		{
			name:"Transaksi",
			funct:()=>{
				this.defaultColDef={
					resizable:true,
					sortable: true,
					filter: true,
					editable:false,
				};
				this.gridOptions.onRowClicked=(event:any)=>{
					let dataId=event.data._id;
					this.selectedDataId=(dataId);
					this.selectedRowId=event.api.getFocusedCell().rowIndex;
					this.selectedColId=event.api.getFocusedCell().column.colId;
					this.precisionGet(this.currentPage,dataId).subscribe(x=>{
						let rowNode=this.gridOptions.api.getRowNode(this.selectedRowId);
						//this.updateTable(x)
						if(!!this.errorHandler(x))return
						let data:any=x;
						rowNode.updateData(this.tableDataHandler([data])[0]);
						
						console.log(this.aaa);
						
						
						this.modalService.open(this.aaa, { ariaLabelledBy: 'modal-basic-title' }).result.then(
							(result) => {
								this.closeResult = `Closed with: ${result}`;
							},
							(reason) => {
								this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
							},
						);
						
						return data;
					});
					
					
					
				};
				this.activeNav="Transaksi";
			},
		},
	];
	/// NAV HANDLER ///
	
	/// ag-grid handler ///
	public gridApi:any;
	public gridColumnApi:any;
	public defaultColDef: ColDef = {
		resizable:true,
		sortable: true,
		filter: true,
		editable:false,
	};
	private getColumnDefs=(data:any)=>{
		let tableColumn=Object.keys(data[0]);
		let temp:ColDef[];
		temp=[];
		tableColumn.map((item:string)=>{
			let pushVar:any={};
			if(item==="_id")pushVar["hide"]=true;//hiding _id column
			if(item==="Ctn")pushVar["editable"]=false;
			pushVar["field"]=item;
			
			temp.push(pushVar)
			
		});
		return temp;
	};
	public gridOptions:any= {
		columnDefs: [],
		pagination: true,
		rowSelection: 'single',
		onRowClicked: ()=>alert("ERR"),
		onCellEditingStarted:(event:any)=>{
			let dataId=event.data._id;
			console.log("cell editing...","id = ",dataId);
			let data=JSON.parse(JSON.stringify(event.data));//create new persistence instance of 'data' instead of Object reference
			this.updateDataOld=data;
			console.log("updateDataOld",this.updateDataOld)
			this.selectedDataId=(dataId);
			this.selectedRowId=event.api.getFocusedCell().rowIndex;
			this.selectedColId=event.api.getFocusedCell().column.colId;
			

		},
		onCellEditingStopped:(event:any)=>{
			let data={
				_id:event.data._id,
				[this.selectedColId]:event.data[this.selectedColId],
			};
			let id=this.selectedDataId;
			this.updateDataNew=data;
			if(JSON.stringify(this.updateDataOld)===JSON.stringify(data))return
			this.update(this.currentPage,id,data);
			console.log("cell edited","id = ",id,"new data = ",data)
		},
		onRowDataUpdated:(event:any)=>{
			console.log("event fired : onRowDataUpdated");
			this.selectedDataId=-1;
			this.selectedRowId=null;
			this.selectedColId="";
		},
		onColumnResized: (event:any) => {},
	};
	public rowData:Array<any>=[];
	/// ag-grid handler ///
	
	/// excel handler ///
	private docName:any;
	private sheetName:any;
	//private tableColumn:any;
	private processedData:any;
	private dataPreProcessing=(excelData:any)=>{
		let docName=Object.keys(excelData)[0];
		let sheetName=Object.keys(excelData[docName])[0];
		//let tableColumn=Object.keys(excelData[docName][sheetName][0]);
		let processedData=excelData[docName][sheetName];
		
		this.docName=docName;
		this.sheetName=sheetName;
		//this.tableColumn=tableColumn;
		this.processedData=processedData;
		return this.processedData;
	};
	/// excel handler ///
	
	/// MAIN ///
	refresh=()=>{
		this.get(this.currentPage);
	};
	updateTable=(data:any)=>{
		this.dataIsNotEmpty=false;
		let dataIsEmpty=!!(Object.keys(data).length<1||data===null);
		let dataIsObject=!(data.length);
		if(dataIsObject)data=[data];
		if(dataIsEmpty){
			this.isLoaded=true;	
			return
		}else{
			this.dataIsNotEmpty=true;
			this.isLoaded=true;	
			
			data=this.tableDataHandler(data);
			
			this.rowData=data;	
			this.gridOptions.columnDefs=this.getColumnDefs(data);	
			return data;
		};
	};
	get=(page:string)=>{
		this.isLoaded=false;	
		return this.globalService.getData(page,undefined).subscribe(x=>this.updateTable(x));
	};
	post=(page:string,data:any)=>{
		this.isLoaded=false;	
		console.log("page",page);
		console.log("data",data);
		this.globalService.excelHandler(data,this.tableColumn).then(x=>{
			let api1=this.globalService.postData(page,x);
			api1.subscribe(x=>this.updateTable(x));
		})
	};
	precisionDelete=(id:number)=>{
		if(id===null)return
		this.isLoaded=false;	
		console.log(id);
		let page=this.currentPage;
		
		let temp=confirm("delete : "+id+" ?");
		if(temp===true)return this.globalService.deleteData(page,id).subscribe(x=>{
			this.refresh();
		})
		return
	};
	precisionGet=(page:string,id:number)=>{
		return this.globalService.getData(page,id);
	};
	deleteAll=(page:string)=>{
		this.isLoaded=false;	
		let temp=confirm("delete ALL : "+page+" ?");
		console.log(temp)
		/*
		if(temp===true)return this.globalService.wipeData(page).subscribe(x=>{
			this.updateTable(x);
		})*/
		
		if(temp===true){
		
			let api1=this.globalService.wipeData(page);
			api1.subscribe(x=>{
				if(!!this.errorHandler(x))return
				return
				this.refresh();
			});
			
			
		}else{
			return
		}
	};
	update=(page:string,id:number,data:any={})=>{
		let oldData = this.updateDataOld;
		let newData = this.updateDataNew;
		let rowNode=this.gridOptions.api.getRowNode(this.selectedRowId);
		let temp=confirm("update : "+JSON.stringify(oldData)+" => "+JSON.stringify(newData));
		if(temp===true){
			this.globalService.putData(page,id,data).subscribe(x=>{
				if(!!this.errorHandler(x))return
				let data:any=x;
				console.log(data)
				rowNode.updateData(this.tableDataHandler([data])[0]);
				return
			});
		}else {
			rowNode.setData(oldData);
		}
	};
	errorHandler=(data:any)=>{
		this.isLoaded=true;
		console.log("errorHandler : "+!!data.errMessage,data);
		let errStatus=true;
		if(!!data.errMessage) return this.errMessage=data.errMessage;
		return !errStatus
	};
	tableDataHandler=(data:any)=>{
		console.log(data);
		//data=data._doc;
		let a=JSON.parse(JSON.stringify(data));
		let temp:any=[];
		let sumArray=(arr:Array<any>,colName:any)=>{
			let temp1:any=0;
			arr.forEach(item=>{
				temp1+=item[colName]
			})
			return temp1
		};
		let i=0;
		a.map((dataItem:any)=>{
			temp[i]={};
			Object.keys(dataItem).map(dataItemPointer=>{
				if(dataItemPointer==="transaction")temp[i]["Ctn"]=sumArray(dataItem[dataItemPointer],"value");
					else temp[i][dataItemPointer]=dataItem[dataItemPointer];
			})
			i++;
		});
		console.log(temp)
		return temp;
	};
}

