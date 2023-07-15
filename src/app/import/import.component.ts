import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { UploadComponent } from '../misc/upload/upload.component';
import { DataTableComponent } from '../misc/data-table/data-table.component';
import { GlobalService } from '../service/global/global.service';
import { GlobalVar } from '../globalVar'
import { ColDef } from 'ag-grid-community';

import { DynamicModalComponent } from '../misc/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../misc/dynamic-table/dynamic-table.component';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidateForm, ValidateFormNotZero } from '../shared/formValidator';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css',]
})

export class ImportComponent {
	private globalService : GlobalService = inject(GlobalService);
	private globalVar = GlobalVar;
	private fb : FormBuilder = inject(FormBuilder);
	private consoleDump = GlobalVar.consoleDump;
	
	public downloadExcel = this.globalService.downloadExcel;
	public testModal=this.globalService._modal.createModal;
	
	
	formTest : any;

	//public formTest:any=0;
	
	constructor(){
		this.currentPage=this.globalService.getCurrentPage();
		this.message=this.globalVar.import.message;
		this.navInit();
		this.refresh();
	};
	ngOnInit(){
			console.log(this);
			
	};

	public Object=Object;//enable the use of "Object" method inside angular component ex: looping an object
	public console=console;//enable the use of "console" method inside angular component
	public JSON=JSON;//enable the use of "JSON" method inside angular component
	public message:any;
	public errMessage:any;
	public currentPage:string;//current page / database used => import
	public isLoaded:boolean=false;//loading placeholder
	public dataIsNotEmpty:boolean=false;//empty data placeholder
	public selectedDataId:number=-1;//self explanatory, for 'precision usage'
	public rowHeight:number=20;
	private selectedRowId:number | null=null;//self explanatory, for 'precision usage'
	private selectedColId:string="";//self explanatory, for 'precision usage'
	private updateDataOld:any;
	private updateDataNew:any;
	private tableColumn:Array<any>=this.globalVar.import.tableColumn;
	
	
	public testFunct=(x:any)=>{
		//let eventData=x.target.value;
		//this.rowHeight=x.target.value;
		//this.gridOptions.api.resetRowHeights()


	}
	
	/// MODAL HANDLER ///
	public modalService:NgbModal=inject(NgbModal);
	@ViewChild("mainModal") mainModal!:DynamicModalComponent;
	@ViewChild("newTransactionModal") newTransactionModal!:DynamicModalComponent;
	@ViewChild(DataTableComponent) child!:DataTableComponent;

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
	public modalData:any;
	public modalRef:any;
	public openMainModal=(modalData:any)=>{
		this.modalData={
			_id:modalData._id,
			Seri:modalData.Seri,
			Jenis:modalData.Jenis,
			Qty:modalData.Qty,
			Kode:modalData.Kode,
			Ctn:this.sumAll(modalData.transaction,"value"),
			transaction:modalData.transaction,
		};
		this.modalRef=this.modalService.open(this.mainModal);
	};
	public closeModal=()=>{
		this.modalRef.close();
	}
	
	public newTransactionModalRef:any;
	public modalTransactionCount=new this.globalVar.counter(0,1).up();
	public defaultTransactionTableColumnDefs={
		value:{
			headerName:'Nilai',
		},
		subject:{
			headerName:'Oleh',
		},
		date:{
			headerName:'Tanggal',
			callback:(x:any)=>{
				return new Date(x).toString();
			},
		},
		_id:{
			hidden:true,
		},
	};
	public resetTransactionValue=()=>{
		this.formTest.get("update").setValue(0);
	};
	public queryUpdateValue:number=0;
	public openNewTransactionModal=(modalData:any)=>{
		this.queryUpdateValue=0;
		this.formTest=this.fb.group({
			_id:[modalData._id],
			init:[modalData.Ctn],
			update:[0,[Validators.required,ValidateFormNotZero]],
			final:[0,[Validators.required,ValidateForm]],
			keterangan:["-"],
		});
		
		let formInit=this.formTest.get("init");
		let formUpdate=this.formTest.get("update");
		let formFinal=this.formTest.get("final");
		
		let temp=formInit.value+formUpdate.value
		formFinal.setValue(temp,{onlySelf:true});
		let alreadyOnce:boolean=false;
		formInit.disable();
			
		formUpdate.valueChanges
			.subscribe((x:number)=>{
				if(alreadyOnce){alreadyOnce=false}
				else{
					alreadyOnce=true
					this.queryUpdateValue=formUpdate.value;
					formFinal.setValue(formInit.value+formUpdate.value);
					console.log('Valid?', this.formTest.valid)
				};
			})
			
		formFinal.valueChanges
			.subscribe((x:number)=>{
				if(alreadyOnce){alreadyOnce=false}
				else{
					alreadyOnce=true
					formUpdate.setValue(formFinal.value-formInit.value);
					this.queryUpdateValue=formUpdate.value;
					console.log('Valid?', this.formTest.valid)
				};
			})	
		this.newTransactionModalRef=this.modalService.open(this.newTransactionModal);
	};
	public newTransactionSubmit=()=>{
		let id=this.formTest.value._id;
		let postData={
			value:this.formTest.value.update,
			keterangan:this.formTest.value.keterangan,
		};
		console.log("onSubmit : ", postData);
		this.post(this.currentPage,postData,"transaction",id).subscribe(x=>{
			this.newTransactionModalRef.close();
			Object.assign(this.modalData,{Ctn:this.sumAll(this.modalData['transaction'],'value')});
		})
	};
	private sumAll=(data:any,colName:any)=>{
		try{
			let temp=0;
			data.map((item:any)=>{
				temp+=item.value;
			})
			return temp;
		}catch(e){
			return -1;
		}
	};
	
	

	public _modal:any={
		filterModal:{
			old_open:(modalName:string,data:Array<any>)=>{
				console.log('this._modal.filterModal.filterModel',this._modal.filterModal.getFilterModel);
				let temp=this._modal.filterModal.generateFilterData(data);
				this._modal.filterModal.filterData=temp;
				this.modalService.open(modalName);
			},
			open:()=>{
				console.log('this._modal.filterModal.filterModel',this._modal.filterModal.getFilterModel);
				this._modal.filterModal.filterElementIsActive=!this._modal.filterModal.filterElementIsActive;
				let excludedColArray=this._modal.filterModal.excludedColArray;
				let data=this.excludeCol(this._modal.filterModal.getDisplayData(),excludedColArray);
				let temp=this._modal.filterModal.generateFilterData(data);
				this._modal.filterModal.filterData=temp;
			},
			generateFilterData:(data:Array<any>)=>{
				let temp:any={};
				let dataColumn=Object.keys(data[0]);
				dataColumn.map(pointer=>{
					temp[pointer]=[];
				});
				data.map(item=>{
					dataColumn.map(pointer=>{
						temp[pointer].push(item[pointer]);
					});
				});
				dataColumn.map(pointer=>{
					temp[pointer]=[...new Set(temp[pointer])]
					temp[pointer].sort();
				});
				return temp;
			},
			filterData:"",
			filterElementIsActive:false,
			getDisplayData:()=>this.gridOptions.api.rowModel.rowsToDisplay.map((x:any)=>x.data),
			resetFilter:()=>{
				let excludedColArray=this._modal.filterModal.excludedColArray;
				let data=this.excludeCol(this.gridOptions.rowData,excludedColArray);
				let temp=this._modal.filterModal.generateFilterData(data);
				this._modal.filterModal.filterElementIsActive=!this._modal.filterModal.filterElementIsActive;
				this._modal.filterModal.filterData=temp;
				this.gridOptions.api.setFilterModel(null);
			},
			filterSetterObj:{},
			initFilter:(col:Array<any>)=>{//unused
				let temp:any={};
				col.map(pointer=>{
					temp[pointer]={
						filterType: 'text',
						type:'contains',
						filter:'',
					};
				});
				//this.gridOptions.api.setFilterModel(temp);
				console.log(this.gridOptions.api.getFilterModel());
			},
			addFilter:(pointer:string,event:any)=>{
				let eventValue=event.target.value;
				
				let main=this._modal.filterModal;
				let excludedColArray=main.excludedColArray;
				let filterSetterObj=main.filterSetterObj;
				let filterData=main.filterData;
				let generateFilterData=main.generateFilterData;
				let filterModel=main.filterModel;
				
				let temp:any={}
				temp[pointer]={
					filterType: 'text',
					type:'equals',
					filter:eventValue,
				};
				filterSetterObj[pointer]=temp[pointer];
				this.gridOptions.api.setFilterModel(filterSetterObj)
				this._modal.filterModal.filterModel=this.gridOptions.api.getFilterModel();
				
				let newFilterData=this.excludeCol(this.gridOptions.api.rowModel.rowsToDisplay.map((x:any)=>x.data),excludedColArray);
				this._modal.filterModal.filterData=generateFilterData(newFilterData);
				this.consoleDump([
					['this',this],
					['this.excludeCol',this.excludeCol(this.gridOptions.api.rowModel.rowsToDisplay,excludedColArray)],
					['this.gridOptions.api.rowModel.rowsToDisplay',this.gridOptions.api.rowModel.rowsToDisplay],
					['excludedColArray',excludedColArray],
					['_modal.filterModal.filterModel',this._modal.filterModal.filterModel],
				]);
			},
			filterModel:"",
			getFilterModel:()=>this.gridOptions.api.getFilterModel(),
			isFilterActive:(name:string,pointer:string)=>{
				
			},
			excludedColArray:['_id','Ctn'],
		},
	};
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
						if(!!this.errorHandler(x))return
						let data:any=x;
						rowNode.updateData(this.tableDataHandler([data])[0]);
						this.openMainModal(data);
					});					
				};
				this.activeNav="Transaksi";
			},
		},
	];
	public navIsActive=(item:any,comparedItem:any)=>{
		if(item===comparedItem)return true;
		return false;
	};
	/// NAV HANDLER ///
	
	/// OFFCANVAS ///
	private offcanvasService:NgbOffcanvas=inject(NgbOffcanvas);
	public openOffcanvas(content:any) {
		this.offcanvasService.open(content);
	}
	/// OFFCANVAS ///
	
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
			//pushVar["filter"]='agSetColumnFilter';		
			pushVar["autoHeight"]=true;		
			pushVar["field"]=item;	
			temp.push(pushVar)		
		});
		console.log(temp);
		return temp;
	};
	public gridOptions:any= {
		columnDefs: [],
		pagination: true,
		rowSelection: 'single',
		onRowClicked: ()=>alert("ERR"),
		paginationAutoPageSize:false,
		onGridReady:(params:any)=>{
			console.log("grid Event => onGridReady : ");
			window.addEventListener('resize',()=>this.adjustTableContainerSize(), true);
			this.adjustTableContainerSize();
		},
		onCellEditingStarted:(event:any)=>{
			console.log("grid Event => onCellEditingStarted : ");
			let dataId=event.data._id;
			let data=JSON.parse(JSON.stringify(event.data));//create new persistence instance of 'data' instead of Object reference
			this.updateDataOld=data;
			this.selectedDataId=(dataId);
			this.selectedRowId=event.api.getFocusedCell().rowIndex;
			this.selectedColId=event.api.getFocusedCell().column.colId;
		},
		onCellEditingStopped:(event:any)=>{
			console.log("grid Event => onCellEditingStopped : ");
			let data={
				_id:event.data._id,
				[this.selectedColId]:event.data[this.selectedColId],
			};
			let id=this.selectedDataId;
			this.updateDataNew=data;
			this.consoleDump([
				['JSON.stringify(this.updateDataOld)',JSON.stringify(this.updateDataOld)],
				['JSON.stringify(data)',JSON.stringify(data)],
			])
			if(JSON.stringify(this.updateDataOld)===JSON.stringify(event.data))return
			this.update(this.currentPage,id,data);
		},
		onPaginationChanged:(params:any)=>{
			if(!params.newPage)return
			console.log("grid Event => paginationChanged : ");
			this.gridOptions.columnApi.autoSizeAllColumns();
			console.log("dataTable(child) =>  : ",this.adjustTableContainerSize());
		},
		onRowDataUpdated:(event:any)=>{
			console.log("grid Event => onRowDataUpdated : ");
			this.selectedDataId=-1;
			this.selectedRowId=null;
			this.selectedColId="";
			this.gridOptions.api.setHeaderHeight(20);
			this.gridOptions.columnApi.autoSizeAllColumns();
		},
		onColumnResized: (event:any) => {
			console.log("grid Event => onColumnResized : ");
		},
	};
	public rowData:Array<any>=[];
	public tableContainerStyle:any={};
	@ViewChild('filterModalBody') set filterModalBody(element:any) {
		if (element) {
			console.log(element);
			setTimeout(() => {
				this.adjustTableContainerSize();
			});
		}
	};
	public adjustTableContainerSize=()=>{
		console.log("dataTable event => this.adjustContainerSize()");
		let navContainer=document.getElementById("navContainerId");
		let navContainerRect=navContainer?.getBoundingClientRect();
		let navContainerHeight:number=0;
		if(!!navContainerRect?.height)navContainerHeight=navContainerRect?.height;
		////////////////////////////////////////////
		let filterContainer=document.getElementById("nonModalFilterId");
		let filterContainerRect=filterContainer?.getBoundingClientRect();
		let filterContainerHeight:number=0;
		if(!!filterContainerRect?.height)filterContainerHeight=filterContainerRect?.height;
		////////////////////////////////////////////
		let container=document.getElementById("gridTable")!;
		let containerRect=container.getBoundingClientRect();
		let containerRectTop=containerRect.top;
		////////////////////////////////////////////
		let innerTable=document.querySelectorAll('[Class=ag-center-cols-container]')[0];
		let innerTableRect=innerTable?.getBoundingClientRect();
		let innerTableRectRight:number=0;;
		if(!!innerTableRect?.right)innerTableRectRight=innerTableRect.right;
		/////////////////////////////////////////////
		let scrollBar=document.querySelectorAll('[Class=ag-body-vertical-scroll-viewport]')[0];
		let scrollBarRect=scrollBar?.getBoundingClientRect();
		let scrollBarRectWidth=scrollBarRect?.width;
		//////////////////////////////////////////////
		if(!!innerTable){
			let innerTableWidth=innerTable.getBoundingClientRect().width;
			let windowWidth=window.innerWidth;
			let width="30%";
			let height="100%";
			if(innerTableWidth>=windowWidth)width="auto";
			else{
				width=(innerTableRectRight+scrollBarRectWidth)+"px";
			}
			let marginBottom:number=-5;
			height=(window.innerHeight-containerRectTop+window.scrollY-navContainerHeight-filterContainerHeight)+marginBottom+"px";
			this.tableContainerStyle={
				width:width,
				height:height,
			};
		};
		
	};
	public gridSearch=(event:any)=>{
		let data=event.target.value;
		this.gridOptions.api.setQuickFilter(data);
	}
	/// ag-grid handler ///
	
	/// excel handler ///
	private docName:any;
	private sheetName:any;
	private processedData:any;
	private dataPreProcessing=(excelData:any)=>{
		let docName=Object.keys(excelData)[0];
		let sheetName=Object.keys(excelData[docName])[0];
		let processedData=excelData[docName][sheetName];
		this.docName=docName;
		this.sheetName=sheetName;
		this.processedData=processedData;
		return this.processedData;
	};
	postExcel=(dbName:string,data:any)=>{
		this.isLoaded=false;	
		this.globalService.excelHandler(data).then(x=>{
			let api1=this.globalService.postData(dbName,x);
			api1.subscribe(x=>this.updateTable(x));
		})
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
	post=(dbName:string,data:any,embedName:string|undefined,id:string|undefined)=>{
		return this.globalService.postEmbedData(dbName,data,embedName,id);
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
		let temp=confirm("delete ALL : "+page+" ?");
		console.log(temp)
		if(temp===true){
			this.isLoaded=false;	
			let api1=this.globalService.wipeData(page);
			api1.subscribe(x=>{
				if(!!this.errorHandler(x))return
				return this.refresh();
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
	tableDataHandler=(data:any)=>{		//data=data._doc;
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
		return temp;
	};
	excludeCol=(data:Array<any>,exCol:Array<string>)=>{
		///return array of object except excluded by exCol array
		let temp:any=[];
		let i=0;
		let isValid:any;;
		data.map(item=>{
			temp[i]={};
			Object.keys(item).map(pointer=>{
				isValid=1;
				exCol.map(exColPointer=>{
					if(!!(pointer===exColPointer)){
						isValid--;
					};
				});
				if(!!isValid){
					temp[i][pointer]=item[pointer];
				};
			});
			i++;
		})
		return temp;
	}
}

