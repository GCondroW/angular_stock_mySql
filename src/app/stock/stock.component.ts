import { Component,OnInit,inject, Input, ViewChild } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadComponent } from '../misc/upload/upload.component';
import { DataTableComponent } from '../misc/data-table/data-table.component';
import { GlobalService } from '../service/global/global.service';
import { GlobalVar } from '../globalVar'
import { DynamicTableComponent } from '../misc/dynamic-table/dynamic-table.component';
import { DynamicModalComponent } from '../misc/dynamic-modal/dynamic-modal.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { StockValidators } from '../shared/formValidator';
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
	public viewArr=Object.keys(this.stock.stock);
	public activeView:any=this.viewArr[0];//public activeView=this.viewArr[1];
	
	//public operation:any={}
	public operation:any={
		mode:{
			view:{
				gridOptions:{
					onRowDoubleClicked:(event:any)=>{
						this.modal.modal_1.openModal(event.data);
					},
				},
			},
			edit:{
				gridOptions:{
					onRowDoubleClicked:(event:any)=>{
						console.log("placeHolder edit operation event")
					},
				},
			},
			delete:{
				gridOptions:{
					onRowDoubleClicked:(event:any)=>{
						console.log(this.gridOptions);
						console.log("placeHolder delete operation event")		
					},
				},
				selectedData:null,
				deleteFunction:(data:any)=>{
					this.delete(data);
				},
			},
		},
		active:'view',
		changeOperation:(name:string)=>{
			this.operation.active=name

		},
		updateGridOptions:()=>{
			console.log('updateGridOptions , gridOptions');
			/*
			let gridOptions=this.operation.mode[this.operation.active].gridOptions;
			Object.keys(gridOptions).map(pointer=>{
				this.gridOptions[pointer]=gridOptions[pointer];
				console.log('grid Options pointer :',pointer);
			})
			*/
		},
	};
	
	private fb : FormBuilder = inject(FormBuilder);
	
	public dataIsReady:Boolean=false;
	public navigationPages:any;
	public debugThis:any='';
	constructor(){
		this.navigationPages=GlobalVar.pages;
		this.operation.active=Object.keys(this.operation.mode)[0];
		
	};
	ngOnInit(){
		this.socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });
		this.socket.on("__1", (arg1:{
			data:any[],
			request:string,
			message:string,
			dbKey:string,
		}) => {
			console.log('arg1 : ',arg1)
			let emitRequest=arg1.request;
			let alertArr:Array<any>=[];
			let data:Array<any>=[];
			let oldData:Array<any>=[];
			let newData:any;
			let temp:Array<any>=[];
			console.log("emitRequest=",emitRequest);
			switch(emitRequest){
				case 'add_few':
					
					break;
				case 'add':
					data=arg1.data;
					data.map((item:any)=>{
						alertArr.push({
							nama:item.nama,
							supplier:item.supplier,
							kategori:item.kategori,
						});
					});
					alert(GlobalVar.alert(alertArr,arg1.message));
					this.getDbKey(arg1.dbKey);
					oldData=this.stock.raw;
					temp=oldData;
					newData=data;
					temp.push(...newData);
					this.stock.set(temp);
					this.changeView(this.activeView);
					break;
				case 'add_transaksi':
					data=arg1.data;
					data.map((item:any)=>{
						alertArr.push({
							nama:item.nama,
							supplier:item.supplier,
							kategori:item.kategori,
						});
					});
					alert(GlobalVar.alert(alertArr,arg1.message));
					this.getDbKey(arg1.dbKey);
					oldData=this.stock.raw;	
					newData=data;
					let index:any='';
					newData.map((item:any)=>{
						index=oldData.map(item2=>item2._id);
						index=index.findIndex((item3:any)=>item3===item._id);
						oldData[index].transaksi=item.transaksi;
					})
					this.stock.set(oldData);
					this.changeView(this.activeView);
					break;
				case 'delete':
					data=arg1.data;
					data.map((item:any)=>{
						alertArr.push({
							nama:item.nama,
							supplier:item.supplier,
							kategori:item.kategori,
						});
					});
					alert(GlobalVar.alert(alertArr,arg1.message));
					this.getDbKey(arg1.dbKey);
					oldData=this.stock.raw;
					let deletedData=data;
					let oldDataId=oldData.map(item=>item._id);
					let deletedDataId=deletedData.map((item:any)=>item._id);					
					temp=oldData.filter((item:any)=>!deletedDataId.includes(item._id));
					console.log('empty Delelt',temp);
					this.stock.set(temp);
					this.changeView(this.activeView);
					break;
				default :
				return
			};	
		});
		this.debugThis=this;
		this.get(this.currentPage);
		
	};
	
	/// OFFCANVAS ///
	private offcanvasService:NgbOffcanvas=inject(NgbOffcanvas);
	public _offCanvas={
		open:(content:any)=>this.offcanvasService.open(content),
	};
	/// \OFFCANVAS ///
	
	/// MODAL ///
	public modalService:NgbModal=inject(NgbModal);
	@ViewChild('modal_1') modal_1!:DynamicModalComponent;//modal1
	@ViewChild('modal_2') modal_2!:DynamicModalComponent;//modal transaksi
	@ViewChild('modal_3') modal_3!:DynamicModalComponent;//modal add
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
						callback:(x:any)=>new Date(x).toLocaleString('id'),
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
					update:[0,[Validators.required,StockValidators.update]],
					final:[modalData.ctn,[Validators.required,StockValidators.final]],
					jenis:["-"],
					keterangan:["-"],
				},
				{
					validator:StockValidators.number,
				});
				let form=this.modal.modal_2.form;
				let formUpdateValue=form.get("update");
				let formFinalValue=form.get("final");
				let formJenisValue=form.get("jenis");
				//formJenisValue.disable();
				console.log("formUpdateValue",formUpdateValue)
				let alreadyOnce:boolean=false;
				this.modal.modal_2.isInteracted=false
				
				let f_1=(x:any)=>{
					console.log(x)
					if(!(x>0) && !(x<0)) return formJenisValue.setValue("-");
					if(x<0) return this.modal.modal_2.form.get('jenis').setValue("KELUAR");
					if(x>0) return this.modal.modal_2.form.get('jenis').setValue("MASUK");
					return(alert('error'));
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
				let data={
					_id:this.modal.modal_2.form.value._id,
					value:this.modal.modal_2.form.value.update,
					jenis:this.modal.modal_2.form.value.jenis,
					keterangan:this.modal.modal_2.form.value.keterangan,
				};
				this.postEmbed(this.currentPage,data,"transaksi",data._id);
				this.modal.modal_2.closeModal();
			},
		},
		modal_3:{
			openModal:()=>{
				this.modal.modal_3.modalRef=this.modalService.open(this.modal_3);
			},
			closeModal:()=>{
				this.modal.modal_3.modalRef.close();
			},
			data:{},
			modalRef:undefined,
			getDatalist:(pointer:string)=>this.stock.stock.daftar.filterData[pointer],
		},
	};
	/// \MODAL ///
	
	/// EXCEL ///
	public _excel={
		postExcel:(dbName:string,data:any)=>{
			this.gridOptions.api?.showLoadingOverlay();
			this.globalService.excelHandler(data).then(x=>{
				console.log("Excel : ", x)
				this.rw(()=>this.globalService.postData(dbName,x));
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
	public getAllAgGridRows=()=>{
		this.gridOptions.api.selectAll();
		let returnVar=this.gridOptions.api.getSelectedRows();
		this.gridOptions.api.deselectAll;
		console.log(returnVar)
		return returnVar
	};
	public filter:any={
		getCurrentFilter:()=>this.gridOptions.api.getFilterModel(),
		getDefaultFilterParam:()=>this.stock.stock[this.activeView].defaultFilterParam,
		setFilter:(header:any,filter:any,filterType?:string,type?:string)=>{
			let filterInstance = this.gridOptions.api.getFilterInstance(header); 
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
			this.gridOptions.api.onFilterChanged();
			
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
			this.gridOptions.api?.setColumnDefs(this.stock.stock[this.activeView].colDef);
			this.gridOptions.api?.setFilterModel(this.stock.stock[this.activeView].defaultFilterParam);
			this.gridOptions.api?.showLoadingOverlay();
		},
		onFirstDataRendered:(event:any)=>{
			console.log("grid Event => onFirstDataRendered : ");
			this.adjustTableContainerSize()
		},
		onSelectionChanged:(event: any)=>{
			console.log("selectedData :",this.gridOptions.api.getSelectedRows());
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
			this.operation.mode[this.operation.active].gridOptions.onRowDoubleClicked(event);
		}
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
				if(innerTableWidth===0) width='50%'
				else width=(innerTableRectRight+scrollBarRectWidth)+"px";
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
	};
	public changeView=(view:string)=>{
		this.activeView=view;
		this.gridOptions.api?.deselectAll();
		this.gridOptions.api?.setColumnDefs(this.stock.stock[view].colDef);
		this.gridOptions.api?.setFilterModel(this.stock.stock[view].defaultFilterParam);
		this.gridOptions.api?.hideOverlay();
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
		this.gridOptions.api?.showLoadingOverlay();
		return this.rw(()=>this.globalService.getData(page));
	};
	public updateData=(x:any)=>{
		console.log(Array.isArray(x))	
		console.log(x)
		if(Array.isArray(x)){
			let returnVal=this.stock.set(x);
			this.changeView(this.activeView);
			return returnVal;
		}else{
			try{
				if(!!x.deletedCount) return console.log('delete');
				if(!x.transaksi) return console.log("error, data : ",JSON.stringify(x));
				let oldData=this.stock.raw;
				let oldDataIndex=oldData.findIndex((item)=>item._id===x._id);
				console.log("oldData",oldData);
				console.log("temp",oldData.findIndex((item)=>item._id===x._id))
				let temp;
				temp=oldData;
				temp[oldDataIndex].transaksi=x.transaksi;
				console.log(oldData,x.transaksi);
				let returnVal=this.stock.set(temp);
				this.changeView(this.activeView);
				console.log(this);
				return returnVal;
			}catch{(e:Error)=>{
				console.log("ERR", e)
				alert('error : '+e)
			}};
		};
	};
	postEmbed=(dbName:string,data:any,embedName:string|undefined,id:string|undefined)=>{
		this.gridOptions.api.showLoadingOverlay();
		return this.rw(()=> this.globalService.postEmbedData(dbName,data,embedName,id));
	};
	delete=(data:any)=>{
		this.gridOptions.api.showLoadingOverlay();
		let temp:boolean=false;
		console.log('data',data)
		if(data.length===this.gridOptions.rowData.length){
			temp=confirm(GlobalVar.alert([],"Hapus Semua Data ?"));
		}else{
			temp=confirm(GlobalVar.alert(data,"Hapus Data ?"));
		}
		if(!!temp){
			let idArr:any;
			if(Array.isArray(data))idArr=data.map(item=>item._id);
			let dbName=this.currentPage;
			return this.rw(()=> this.globalService.deleteData(dbName,idArr));
		};
	};
	old_delete=(data:any)=>{
		console.log("delete data :",data);
		return this.rw(()=> this.globalService.deleteData(this.currentPage,data.map((item:any)=>item._id)));
		/*
		let temp=confirm("delete : "+id+" ?");
		if(temp===true)return this.globalService.deleteData(page,id).subscribe(x=>{
			this.refresh();
		})
		return
		*/
	};
	public refresh=()=>{
		console.log('refreshPlaceHolder');
	};
	public misc={

	};
}
