import { Component,OnInit,inject, Input, ViewChild } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UploadComponent } from '../misc/upload/upload.component';
import { DataTableComponent } from '../misc/data-table/data-table.component';
import { GlobalService } from '../service/global/global.service';
import { GlobalVar } from '../globalVar'
import { DynamicTableComponent } from '../misc/dynamic-table/dynamic-table.component';
import { DynamicModalComponent } from '../misc/dynamic-modal/dynamic-modal.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidateForm, ValidateFormNotZero } from '../shared/formValidator';
import { ColDef } from 'ag-grid-community';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})



export class StockComponent {
	private globalService:GlobalService=inject(GlobalService);
	private dbKey=GlobalVar.dbKey;
	public socket:Socket=inject(Socket);
	public currentPage=this.globalService.getCurrentPage(); // >>dbName
	public downloadExcel = this.globalService.downloadExcel;
	
	public JSON=JSON;
	public Object=Object;
	public console=console;
	public toUpperCase="".toUpperCase;
	
	public stock=new GlobalVar.stock([]);
	public viewArr=Object.keys(this.stock.stock)
	public activeView:any=this.viewArr[0];//public activeView=this.viewArr[1];
	
	private fb : FormBuilder = inject(FormBuilder);
	
	public dataIsReady:Boolean=false;
	public navigationPages:any;
	
	constructor(){
		this.navigationPages=GlobalVar.pages;
		
	};
	ngOnInit(){
		this.socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });
		this.socket.on("__1", (arg1:any) => {
			console.log("__1",arg1); // 1
			this.get(this.currentPage);
		});
		console.log(this);
		
	};
	
	
	/// OFFCANVAS ///
	private offcanvasService:NgbOffcanvas=inject(NgbOffcanvas);
	public _offCanvas={
		open:(content:any)=>this.offcanvasService.open(content),
	};
	/// \OFFCANVAS ///
	
	/// MODAL ///
	public modalService:NgbModal=inject(NgbModal);
	@ViewChild('modal_1') modal_1!:DynamicModalComponent;
	@ViewChild('modal_2') modal_2!:DynamicModalComponent;
	//public modalRef:any;
	public modal:any={
		modal_1:{
			openModal:(modalData:any)=>{
				this.modal.modal_1.data=modalData;
				this.modal.modal_1.modalRef=this.modalService.open(this.modal_1);
			},
			closeModal:()=>{
				this.modal.modal_1.modalRef.close();
			},
			data:{},
			modalRef:undefined,
			innerTable:{
				defaultColumnDefs:{
					qty:{
						headerName:'Jumlah',
					},
					jenis:{
						headerName:'Jenis',
					},
					tanggal:{
						headerName:'Tanggal',
						callback:(x:any)=>new Date(x).toLocaleDateString('id'),
					},
					keterangan:{
						headerName:'Keterangan',
					},
					user:{
						headerName:'User',
					},
					_id:{
						hidden:true,
					},
				},
			},
		},
		modal_2:{
			openModal:(modalData:any)=>{
				
				this.modal.modal_2.data=modalData;
				this.modal.modal_2.form=this.fb.group({
					_id:modalData._id,
					update:[0,[Validators.required,ValidateFormNotZero]],
					final:[modalData.ctn,[Validators.required,ValidateForm]],
					jenis:["-"],
					keterangan:["-"],
				});
				let form=this.modal.modal_2.form;
				let formUpdateValue=form.get("update");
				let formFinalValue=form.get("final");
				let formJenisValue=form.get("jenis");
				//formJenisValue.disable();
				console.log("formUpdateValue",formUpdateValue)
				let alreadyOnce:boolean=false;
				
				let f_1=(x:any)=>{
					console.log(x)
					if(!(x>0) && !(x<0)) formJenisValue.setValue("-");
					if(x<0)this.modal.modal_2.form.get('jenis').setValue("KELUAR");
					if(x>0)this.modal.modal_2.form.get('jenis').setValue("MASUK");
					
;					
				};
				
				formUpdateValue.valueChanges.subscribe((x:number)=>{
					if(alreadyOnce){alreadyOnce=false}
					else{
						alreadyOnce=true;
						this.modal.modal_2.isInteracted=true
						let temp=modalData.ctn+x
						formFinalValue.setValue(temp);
						console.log('Valid?', this.modal.modal_2.isValid('update'));
						f_1(formUpdateValue.value);
					}
				})
				
				formFinalValue.valueChanges.subscribe((x:number)=>{
					if(alreadyOnce){alreadyOnce=false}
					else{
						alreadyOnce=true;
						this.modal.modal_2.isInteracted=true
						let temp=x-modalData.ctn;
						formUpdateValue.setValue(temp);
						console.log('Valid?', this.modal.modal_2.isValid('final'));
						f_1(formUpdateValue.value);
					}
				})

				this.modal.modal_2.modalRef=this.modalService.open(this.modal_2);
				console.log("isInteracted",this.modal.modal_2.isInteracted)
				console.log("modal.modal_2.form.get('update').valid",
					this.modal.modal_2.form.get('update').valid)
			},
			closeModal:()=>{
				this.modal.modal_2.modalRef.close();
			},
			isInteracted:false,
			isValid:(formName:string)=>{
				console.log("formn Name ="+formName, this.modal.modal_2.form.get(formName).valid);
				if(this.modal.modal_2.isInteracted)
				{
					return this.modal.modal_2.form.get(formName).valid;
				}
				return false
			},
			data:{},
			form:{},
			modalRef:undefined,
			newTransactionSubmit:()=>{
				console.log(this.modal.modal_2.form);
				let data={
					_id:this.modal.modal_2.form.value._id,
					value:this.modal.modal_2.form.value.update,
					jenis:this.modal.modal_2.form.value.jenis,
					keterangan:this.modal.modal_2.form.value.keterangan,
				};
				let a=this.post(this.currentPage,data,"transaksi",data._id);
					this.modal.modal_2.closeModal();
					console.log(a);

				console.log(data);
				
			},
		},
	};
	/// \MODAL ///
	
	/// EXCEL ///
	public _excel={
		postExcel:(dbName:string,data:any)=>{
			this.globalService.wipeData(dbName).subscribe(x=>{
				this.globalService.excelHandler(data).then(x=>{
					console.log("Excel : ", x)
					this.rw(()=>this.globalService.postData(dbName,x));
				});
			});				
		},
		downloadExcel:this.globalService.downloadExcel,
	};
	/// \EXCEL ///
	
	/// AG-GRID ///
	
	public defaultColDef: ColDef = {
		resizable:true,
		sortable: true,
		filter: true,
		editable:false,
		getQuickFilterText: function(params) {
			return params.colDef.hide ? '' : 
				params.colDef.field!='nama' ? '' : params.value; 
		}
	};	
	
	public filter:any={
		getCurrentFilter:()=>this.gridApi.getFilterModel(),
		getDefaultFilterParam:()=>this.stock.stock[this.activeView].defaultFilterParam,
		setFilter:(header:any,filter:any,filterType?:string,type?:string)=>{
			let filterInstance = this.gridApi.getFilterInstance(header); 
			let defaultFilterParam=this.stock.stock[this.activeView].defaultFilterParam;
			let temp1:any={};
			temp1['filter']=filter;
			if(!filterType){
				if(filterInstance.filterType) return temp1['filterType']=filterInstance.filterType;
				temp1['filterType']=defaultFilterParam[header].filterTykpe;
				
			} else {
				temp1['filterType']=filterType;
			};
			if(!type){
				if(filterInstance.type) return temp1['type']=filterInstance.type;
				temp1['type']=defaultFilterParam[header].type;
			} else {
				temp1['type']=type;
			};
			filterInstance.setModel(temp1);
			this.gridApi.onFilterChanged();
			console.log(" filterInstance : ",filterInstance)
			console.log(" temp : ",temp1)
			console.log(" GRIDAPI : ",this.gridApi)
			
		},
		search:(event:any)=>{
			return this.gridOptions.api.setQuickFilter(event.target.value);
		},
	};
	
	
	public gridOptions:any= {
		columnDefs:[],
		pagination: true,
		paginationAutoPageSize:false,	
		rowSelection: 'single',
		rowMultiSelectWithClick:true,
		paginationPageSize:50,	
		onGridReady:(params:any)=>{
			console.log("grid Event => onGridReady : ");
			this.gridApi=this.gridOptions.api;	
			this.gridOptions.api.setColumnDefs(this.stock.stock[this.activeView].colDef);
			this.gridOptions.api?.setFilterModel(this.stock.stock[this.activeView].defaultFilterParam);
		},
		
		onFirstDataRendered:(event:any)=>{
			console.log("grid Event => onFirstDataRendered : ");
			this.adjustTableContainerSize()
		},
		
		onCellEditingStarted:(event:any)=>{
			console.log("grid Event => onCellEditingStarted : ");
		},
		onCellEditingStopped:(event:any)=>{
			console.log("grid Event => onCellEditingStopped : ");
		},
		onPaginationChanged:(params:any)=>{
			console.log("grid Event => paginationChanged : ");
		},
		onRowDataUpdated:(event:any)=>{
			console.log("grid Event => onRowDataUpdated : ");
		},
		onFilterChanged:(event:any)=>{
			console.log("grid Event => onFilterChanged : ");
		},
		onColumnResized: (event:any) => {
			console.log("grid Event => onColumnResized : ");
		},
		onModelUpdated: (event:any)=>{
			console.log("grid Event => onModelUpdated : ");
			this.adjustTableContainerSize()
		},
		onComponentStateChanged:(event:any)=>{
			console.log("grid Event => onComponentStateChanged : ");
		},
		onRowDoubleClicked:(event:any)=>{
			console.log("grid Event => onRowDoubleClicked : ");
			console.log(event);
			this.modal.modal_1.openModal(event.data)
		},
	};
	public gridApi:any;//initialize at gridOptions.onGridReady
	public tableContainerStyle:{width:string,height:string}={width:'auto',height:'0px'};
	public adjustTableContainerSize=()=>{
		console.log("dataTable event => this.adjustContainerSize()");
		let navbarHeight=document.getElementById("navbarId")?.clientHeight;
		if(navbarHeight===undefined)navbarHeight=0;
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
			let width="50%";
			let height:any="100%";
			console.log("innerTableWidth>=windowWidth",innerTableWidth,windowWidth)
			if(innerTableWidth>=windowWidth){
				width="auto";
			}
			else{
				width=(innerTableRectRight+scrollBarRectWidth)+"px";
			}
			let marginBottom:number=0;
			let tempHeight=(window.innerHeight-containerRectTop+window.scrollY)+marginBottom;
			height=22*Math.floor(tempHeight/22)+11;
			let temp={
				width:width,
				height:height+'px',
			};
			
			if(JSON.stringify(this.tableContainerStyle)===JSON.stringify(temp))return
			
			this.tableContainerStyle=temp;
			console.log("tableHeight",height);
			console.log("tableWidth",width);
			console.log("aaa0",this.gridOptions.paginationPageSize=(22*Math.floor((height-navbarHeight)/22)/22));
		};
		this.gridOptions.api.hideOverlay();
		
	};
	public changeView=(view:string)=>{
		this.activeView=view;
		this.gridOptions.api?.setColumnDefs(this.stock.stock[view].colDef);
		this.gridOptions.api?.setFilterModel(this.stock.stock[view].defaultFilterParam);
		console.log('this.gridOptions.api?',this.gridOptions.api)
	};
	/// \AG-GRID ///
	
	rw=(request:any)=>{
		console.log("Request",request);
		return request().subscribe((x:any)=>{
			if (!!x.ERR) return alert(x.ERR.message);
			if (!!x.dbKey){
				let dbKey=x.dbKey.toString();
				this.getDbKey(dbKey)
				return this.rw(()=>request());
			}else this.updateData(x);
		});
	};
	getDbKey=(dbKey:string)=>{
		console.log("dbKey : ",dbKey )
		GlobalVar.dbKey=dbKey;
		alert ("set db key "+JSON.stringify(GlobalVar.dbKey));
		this.globalService.setHeaders("dbKey",dbKey);
	};
	get=(page:string)=>{
		return this.rw(()=>this.globalService.getData(page));
	};
	public updateData=(x:any)=>{
		console.log(Array.isArray(x))
		
		if(Array.isArray(x)){
			let returnVal=this.stock.set(x);
			this.changeView(this.activeView);
			return returnVal;
		}else{
			try{
				
				if(!x.transaksi) throw new Error('Err no transaksi');
				let oldData=this.stock.raw;
				let oldDataIndex=oldData.findIndex((item)=>item._id===x._id);
				console.log("oldData",oldData);
				console.log("temp",oldData.findIndex((item)=>item._id===x._id))
				let temp=oldData[oldDataIndex].transaksi=x.transaksi;
				console.log(oldData,x.transaksi);
				let returnVal=this.stock.set(temp);
				this.changeView(this.activeView);
				console.log(this);
				return returnVal;
			}catch{(e:Error)=>{
				console.log("ERR", e)
				alert('error : '+e)
			}};
		}
	};
	post=(dbName:string,data:any,embedName:string|undefined,id:string|undefined)=>{
		return this.rw(()=> this.globalService.postEmbedData(dbName,data,embedName,id));
	};
	public refresh=()=>{
		console.log('refreshPlaceHolder');
	};
	public misc={

	};
}
