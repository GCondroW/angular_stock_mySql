import { Component,OnInit,Injectable,inject, Input, ViewChild } from '@angular/core';
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
import { GlobalValidator } from '../shared/formValidator';
import { ColDef } from 'ag-grid-community';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})

export class StockComponent {
	public fDebug:boolean=false;
	public version:string="0.18.0"
	private globalService:GlobalService=inject(GlobalService);
	private dbKey=GlobalVar.dbKey;
	public socket:Socket=inject(Socket);
	public currentPage=this.globalService.getCurrentPage(); // >>dbName
	public downloadExcel = this.globalService.downloadExcel;
	public JSON=JSON;
	public Object=Object;
	public console=console;
	public stock=new GlobalVar.stockData();
	public user=new GlobalVar.user(
		localStorage.getItem('name'),
		localStorage.getItem('id'),
		Number(localStorage.getItem('dbKey')),
		localStorage.getItem('tableData'),
	);
	private localOptions=JSON.parse(localStorage.getItem('options')||'{}');
	private localTableOptions=
		this.localOptions.tableOptions?
		{tableOptions:this.localOptions.tableOptions}
		:
		{tableOptions:GlobalVar.defaultColumnDefs};
	private localActiveViewOptions=
		this.localOptions.activeView?
		{activeView:this.localOptions.activeView}
		:
		{activeView:Object.keys(this.stock.daftar)[0]};
	private corsConfig=
		this.localOptions.corsConfig?
		{corsConfig:this.localOptions.corsConfig}
		:
		{corsConfig:GlobalVar.config.defaultValue.cors};

	public options=new GlobalVar.options(Object.assign(this.localTableOptions,Object.assign(this.localActiveViewOptions,this.corsConfig)));
	public activeView:any="";
	private fb : FormBuilder = inject(FormBuilder);
	public navigationPages:any;
	public debugThis:any='';
	public lastRequest:any;
	public temp:any=[];
	public defaultFIlterParam:{[index:string]:any}={};
	public operation:any={
		mode:{
			view:{
				gridOptions:{
					onRowDoubleClicked:(event:any)=>{
						if(this.activeView==='stock'){
							console.log("event.data",event.data);
							let index=this.user.tableData.stock[this.user.dbKey].findIndex((item:any)=>event.data.ID_DAFTAR===item.ID_DAFTAR)
							console.log("stock data");
							let modalData=this.user.tableData.stock[this.user.dbKey][index];
							console.log("index",index);
							console.log("modalData",modalData);
							this.modal.modal_1.openModal(modalData);
						};
						if(this.activeView==='transaksi')return alert(GlobalVar.alert(event.data));
					},
				},
			},
			edit:{
				gridOptions:{
					onRowDoubleClicked:(data:any)=>{
						let activeView=this.activeView;
						//console.log("data",data);
						let parentId=data.data.ID_DAFTAR;		
						if(activeView==='stock')return this.modal.modal_4.openModal(parentId);
					},
				},
			},
			delete:{
				gridOptions:{
					onRowDoubleClicked:(event:any)=>{
						let activeView=this.activeView;
						console.log(event.data);
						if(activeView==='stock')return this.delete([event.data],'daftar');
						//if(activeView==='transaksi')return this.delete(event.data,activeView);
						return
					},
				},
				selectedData:null,
				deleteFunction:(data:any)=>{
					let activeView=this.activeView;
					if(activeView==='stock')return this.delete(data,'daftar');
					//if(activeView==='transaksi')return this.delete(data,activeView);
					return
				},
			},
		},
		active:'view',
		changeOperation:(name:string)=>{
			this.operation.active=name
		},
		updateGridOptions:()=>{
			console.log('updateGridOptions , gridOptions');
		},
	};
	constructor(){
		this.navigationPages=GlobalVar.pages;
		this.operation.active=Object.keys(this.operation.mode)[0];
		let defaultActiveViewValue='stock';
		if(defaultActiveViewValue){
			this.activeView=defaultActiveViewValue;
		}else{
			this.activeView=this.options.data.activeView
				||
				this.options.setOptions(this.activeView,"activeView");
		};
		let localDefaultFilterObj=this.localOptions.filterParams;
		console.log("localDefaultFilterObj",localDefaultFilterObj);
		this.misc.setFilterParams(
			localDefaultFilterObj?
			localDefaultFilterObj:
			this.misc.getDefaultFilterObj()
		);
		console.log("localDefaultFilterObj",this.options.data.filterParams);
		this.globalService.setHeaders("user",this.user.name);
	};
	
	ngOnInit(){
		let switchFallbackFunct=()=>{
			console.log('SWITCH_EXCEPTION_ERROR')
			this.refreshPage();
		};
		this.socket.on("debug",(arg1:any)=>{
			console.log("debug : ",arg1);
		});
		this.socket.on("connect", () => {
			this.misc.loadingWrapper(
				()=>{
					console.log("socket connected, socket : ");
					let clientData={
						name:this.user.name,
						userId:this.user.id,
						dbKey:this.user.getDbKey(),
					};
					this.socket.emit("login",clientData,(response:any)=>{
						let tableData=this.user.getTableData(this.activeView);
						if(!!response.success&&!!tableData){
							//console.log("LOGIN SUCCESS = > ",response);
							this.updateData(tableData);
						}else{
							//console.log("LOGIN FAILED = > ",response);
							//console.log("response.dbKey",response.dbKey)
							this.refreshPage();
						};
					});
				},this.gridOptions
			);
		});
		this.socket.on("login", () => {
			//console.log("socket connected, socket : ");
			this.misc.loadingWrapper(
				()=>{
					console.log("EMIT RECEIVED: LOGIN");
					let clientData={
						name:this.user.name,
						userId:this.user.id,
						dbKey:this.user.getDbKey(),
					};
					this.socket.emit("login",clientData,(response:any)=>{
						if(!!response.success&&!!this.user.getTableData(this.activeView)){
							console.log("LOGIN SUCCESS = > ",response);
							this.updateData(this.user.getTableData(this.activeView));
						}else{
							console.log("LOGIN FAILED = > ",response);
							console.log("response.dbKey",response.dbKey)
							this.refreshPage();
						};
					});
				},this.gridOptions
			);
		});
		this.socket.on("delete",(emittedData:any)=>{
			this.misc.loadingWrapper(
				()=>{
					console.log("EMIT RECEIVED: DELETE =>",emittedData);
					console.log("AT =>",this.activeView);
					
					let message=emittedData.message;
					let deletedDataId=emittedData.deletedDataId;
					
					switch(this.activeView){
						case 'stock':
							let oldData=this.user.getTableData(this.activeView);
							let alertArr:Array<any>=[];
							let deletedData = oldData.filter((item:any)=>deletedDataId.includes(item.ID_DAFTAR));
							deletedData.map((item:any)=>{
								alertArr.push({
									id:item.ID_DAFTAR,
									Nama:item.NAMA,
									Supplier:item.SUPPLIER,
								});
							});
							this.user.setTableData(emittedData.dbKey,this.user.deleteById(deletedDataId,this.activeView),this.activeView);
							this.setDbKey(emittedData.dbKey);
							this.updateData(this.user.getTableData(this.activeView));
							alert(GlobalVar.alert(alertArr,message));
							break;

						default :
							switchFallbackFunct();
					}
				},this.gridOptions
			);
		});
		this.socket.on("get",(emittedData:any)=>{
			alert('get emit');
			console.log("emittedData : ",emittedData);
		});
		this.socket.on("init",(emittedData:any)=>{
			this.misc.loadingWrapper(
				()=>{
					console.log("EMIT RECEIVED: INIT =>",emittedData);
					let data=emittedData.data;
					let message=emittedData.message;
					let dbKey=emittedData.dbKey;
					let alertArr:Array<any>=[];
					
					switch(this.activeView){
						case 'stock':	
							data.map((item:any)=>{
								alertArr.push({
									id:item.ID_DAFTAR,
									Nama:item.NAMA,
									Supplier:item.SUPPLIER,
								});
							});
							this.user.setTableData(emittedData.dbKey,data,this.activeView);
							this.setDbKey(emittedData.dbKey);
							alert(GlobalVar.alert(alertArr,message));
							this.updateData(this.user.getTableData(this.activeView));
							break;
						default:
							switchFallbackFunct();
					};
				},this.gridOptions
			)
		});
		this.socket.on("put",(emittedData:any)=>{
			this.misc.loadingWrapper(
				()=>{
					console.log("EMIT RECEIVED: PUT =>",emittedData);
					let data=emittedData.data;
					let message=emittedData.message;
					let dbKey=emittedData.dbKey;
					let alertArr:Array<any>=[];
					switch(this.activeView){
						case 'stock':
							let oldData=this.user.getTableData(this.activeView);
							data.map((item:any)=>{
								alertArr.push({
									id:item.ID_DAFTAR,
									Nama:item.NAMA,
									Supplier:item.SUPPLIER,
								});
							});
							data.map((item:any)=>{
								
								let id=oldData.findIndex((x:any)=>x.ID_DAFTAR===item.ID_DAFTAR);
								console.log("id",id)
								console.log("before",oldData[id],oldData)
								oldData[id]=item;
								console.log("after",oldData[id],oldData)
							});
							let newAndUpdatedData=oldData;
							this.setDbKey(dbKey);
							this.user.setTableData(dbKey,newAndUpdatedData,this.activeView);
							this.updateData(this.user.getTableData(this.activeView));
							alert(GlobalVar.alert(alertArr,message));
							break;
						default:
							switchFallbackFunct();
					};
				},this.gridOptions
			);
		});
		this.socket.on("post",(emittedData:any)=>{
			this.misc.loadingWrapper(
				()=>{
					console.log("EMIT RECEIVED: POST =>",emittedData);
					let data=emittedData.data;
					let message=emittedData.message;
					let dbKey=emittedData.dbKey;
					let alertArr:Array<any>=[];
					switch(this.activeView){
						case 'stock':
							let oldData=this.user.getTableData(this.activeView);
							data.map((item:any)=>{
								alertArr.push({
									id:item.ID_DAFTAR,
									Nama:item.NAMA,
									Supplier:item.SUPPLIER,
								});
							});
							let newAndUpdatedData=oldData;
							newAndUpdatedData.push(...data);
							this.setDbKey(dbKey);
							this.user.setTableData(dbKey,newAndUpdatedData,this.activeView);
							this.updateData(this.user.getTableData(this.activeView));
							alert(GlobalVar.alert(alertArr,message));
							break;
						default:
							switchFallbackFunct();
					};
				},this.gridOptions	
			);
		});
		this.socket.on("transaksi",(emittedData:any)=>{
			this.misc.loadingWrapper(
				()=>{
					console.log("EMIT RECEIVED: TRANSAKSI =>",emittedData);
					console.log("this.user.getTableData('transaksi')",this.user.getTableData('transaksi'));
					let data=emittedData.data;
					let message=emittedData.message;
					let dbKey=emittedData.dbKey;
					let alertArr:Array<any>=[];
					switch(this.activeView){
						case 'stock':			
							let oldDataTransaksi=this.user.getTableData('transaksi')||[];
							let oldDataStock=this.user.getTableData('stock')||[];
							this.setDbKey(dbKey);
							if(oldDataTransaksi.length>0){
								data.map((item:any)=>{
									oldDataTransaksi.push(item);
								});
								this.user.setTableData(dbKey,oldDataTransaksi,'transaksi');
							};
							if(oldDataStock.length>0){
								let newAndUpdatedData=oldDataStock;
								data.map((item:any)=>{
									let updatedDataIndex=oldDataStock.findIndex((item2:any)=>item2.ID_DAFTAR===item.ID_DAFTAR);
									newAndUpdatedData[updatedDataIndex].STOCK+=item.JUMLAH;
								});
								this.user.setTableData(dbKey,newAndUpdatedData,'stock');
							};
							
							data.map((item:any)=>{
								alertArr.push({
									id:item.ID_DAFTAR,
									Nama:item.NAMA,
									Supplier:item.SUPPLIER,
								});
							});
							this.updateData(this.user.getTableData(this.activeView));
							alert(GlobalVar.alert(alertArr,message));
							break;
						default:
							switchFallbackFunct();
					};
				},this.gridOptions
			);	
		});
		this.debugThis=this;
	};
	/// APIURL ///
	public apiUrl={
		value:this.options.data.corsConfig.url,
		inputValue:"",
		eventHandler:(event:any)=>this.apiUrl.inputValue=event.target.value,
		flush:()=>this.apiUrl.inputValue="",
		set:(event:any)=>{
			if (!this.apiUrl.inputValue||this.apiUrl.inputValue===this.apiUrl.value)return alert ("error")
			let temp=this.options.data.corsConfig;
			temp.url=this.apiUrl.inputValue;
			this.options.setOptions(temp,'corsConfig');
			
			alert("Success, Api Url = "+this.apiUrl.inputValue);
			window.location.reload()
			
		},
	};
	/// \APIURL ///
	/// OFFCANVAS ///
	private offcanvasService:NgbOffcanvas=inject(NgbOffcanvas);
	private offCanvasInstance:any;
	public _offCanvas={
		open:(content:any)=>this.offCanvasInstance=this.offcanvasService.open(content),
	};
	/// \OFFCANVAS ///
	/// MODAL ///
	public modalService:NgbModal=inject(NgbModal);
	@ViewChild('modal_1') modal_1!:DynamicModalComponent;//modal stock
	@ViewChild('modal_2') modal_2!:DynamicModalComponent;//modal transaksi
	@ViewChild('modal_3') modal_3!:DynamicModalComponent;//modal add stock
	@ViewChild('modal_4') modal_4!:DynamicModalComponent;//modal edit stock
	public activeModal:string='';
	public modal:any={
		modal_1:{
			openModal:(modalData:any)=>{
				//this.modal.modal_1.isLoading=true;
				this.modal.modal_1.data=modalData;
				this.modal.modal_1.modalRef=this.modalService.open(this.modal_1);
				//this.modal.modal_1.updateTransactionData(modalData);
				
			},
			isLoading:false,
			updateTransactionData:(modalData:any)=>{
				this.globalService.getData('transaksi',[modalData.ID_DAFTAR]).subscribe(
					(x:any)=>{
						//this.modal.modal_1.transactionData=x.data;
						x.data.map((item:any)=>{
							item.TANGGAL=this.misc.convertDate(item.TANGGAL);
						});
						this.modal.modal_1.grid.gridOptions.api.setRowData(x.data);
						this.modal.modal_1.grid.gridOptions.api?.setColumnDefs(
							this.modal.modal_1.grid.columnDefs.map(
								(item:any)=>
									Object.assign(item,this.modal.modal_1.grid.defaultColumnDefs)
							)		
						);
					}
				);
			},
			grid:{
				gridOptions:{
					pagination: true,
					paginationPageSize:5,	
					paginationAutoPageSize:true,
					accentedSort:true,
					onGridReady:(params:any)=>{
						console.log("grid Event => onGridReady : ");
						let modalData=this.modal.modal_1.data;
						//console.log("resize",this.modal.modal_1.grid.gridOptions.columnApi.autoSizeAllColumns());
						//this.modal.modal_1.isLoading=false;
						this.globalService.getData('transaksi',[modalData.ID_DAFTAR]).subscribe(
							(x:any)=>{
								//this.modal.modal_1.transactionData=x.data;
								x.data.map((item:any)=>{
									item.TANGGAL=this.misc.convertDate(item.TANGGAL);
								});
								this.modal.modal_1.grid.gridOptions.api.setRowData(x.data);
								this.modal.modal_1.grid.gridOptions.api.setColumnDefs(
									this.modal.modal_1.grid.columnDefs.map(
										(item:any)=>
											Object.assign(item,this.modal.modal_1.grid.defaultColumnDefs)
									)		
								);
								//this.modal.modal_1.grid.gridOptions.columnApi.sizeColumnsToFit()
								this.modal.modal_1.grid.gridOptions.columnApi.autoSizeAllColumns();
							}
						);
						
						
					},
					onModelUpdated: (event:any)=>{
						console.log("grid Event => onModelUpdated : ");
					},
					onRowDataUpdated:(event:any)=>{
						console.log("grid Event => onRowDataUpdated : ");
						
					},
					onFirstDataRendered:(event:any)=>{
						console.log("grid Event => onFirstDataRendered : ");
					},
					onColumnVisible:(event:any)=>{
						console.log("grid Event => onColumnVisible : ");
					},
					onViewportChanged:(evet:any)=>{
						console.log("grid Event => onviewportChanged : ");
					},
				},
				defaultColumnDefs:{
					resizable:false,
					sortable: false,
					filter: false,
					editable:false,
				},
				columnDefs:[
					{
						field:'ID_TRANSAKSI',
						headerName:'Id',
						hide:true,
					},
					{
						field:'JUMLAH',
						headerName:'Jumlah',
					},
					{
						field:'TANGGAL',
						headerName:'Tanggal',
						sort: "desc",
						autoHeight: true,
					},	
					{
						field:'USER',
						headerName:'User',
					},		
					{
						field:'JENIS',
						headerName:'Jenis',
					},
					{
						field:'KETERANGAN',
						headerName:'Keterangan',
					},			
					{
						field:'ID_DAFTAR',
						hide:true,
					},
					{
						field:'SUPPLIER',
						hide:true,
					},
					{
						field:'NAMA',
						hide:true,
					},
					{
						field:'KATEGORI',
						hide:true,
					},
				],
			},
			closeModal:()=>{
				this.modal.modal_1.modalRef.close();
			},
			transactionData:[],
			getTransactionData:(id:Array<number>)=>{
				return ;
			},
			deleteFunct:(data:any)=>{
				this.delete([data],'stock');
				this.modal.modal_1.closeModal();
			},
			data:{},
			modalRef:undefined,
			innerTable:{
				defaultColumnDefs:{
					ID_TRANSAKSI:{
						headerName:'Id',
					},
					JUMLAH:{
						headerName:'Jumlah',
					},
					JENIS:{
						headerName:'Jenis',
					},
					TANGGAL:{
						headerName:'Tanggal',
						callback:(x:any)=>new Date(x).toLocaleString('id'),
					},
					KETERANGAN:{
						headerName:'Keterangan',
					},
					USER:{
						headerName:'User',
					},
					NAMA:{
						hidden:true,
					},
					KATEGORI:{
						hidden:true,
					},
					SUPPLIER:{
						hidden:true,
					},	
					ID_DAFTAR:{
						hidden:true,
					},							
					
				},
			},
		},
		modal_2:{
			openModal:(modalData:any)=>{
				
				this.modal.modal_2.data=modalData;
				this.modal.modal_2.form=this.fb.group({
					id:modalData.ID_DAFTAR,
					update:[0,[Validators.required,StockValidators.update]],
					final:[modalData.STOCK,[Validators.required,StockValidators.final]],
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
				this.modal.modal_2.isInteracted=false
				let f_1=(x:any)=>{
					console.log("X   =  >   ",x)
					//if(!(x>0) && !(x<0)) return formJenisValue.setValue("-");
					if(x<0) return formJenisValue.setValue("KELUAR");
					if(x>0) return formJenisValue.setValue("MASUK");
					if(x===null || x===0) return console.log("NULL");
					return formJenisValue.setValue("-");
				};
				
				formUpdateValue.valueChanges.subscribe((x:number)=>{
					if(alreadyOnce){alreadyOnce=false}
					else{
						alreadyOnce=true;
						this.modal.modal_2.isInteracted=true
						let temp=modalData.STOCK+x
						formFinalValue.setValue(temp);
						console.log("x",x);
						console.log("typeof X",typeof(x));
						console.log("STOCK",temp);
						console.log("typeof STOOCK",typeof(modalData.STOCK));
						console.log('Valid?', this.modal.modal_2.isValid('update'));
						f_1(formUpdateValue.value);
					}
				})
				formFinalValue.valueChanges.subscribe((x:number)=>{
					if(alreadyOnce){alreadyOnce=false}
					else{
						alreadyOnce=true;
						this.modal.modal_2.isInteracted=true
						let temp;
						if (x!==null){
							temp = x-(modalData.STOCK);
							formUpdateValue.setValue(temp);
						}else formUpdateValue.setValue("-")
						console.log("x",x);
						console.log("typeof X",typeof(x));
						console.log("STOCK",temp);
						console.log("typeof STOOCK",typeof(modalData.STOCK));
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
			defaultData:{},
			form:{},
			modalRef:undefined,
			newTransactionSubmit:()=>{
				let data={
					ID_DAFTAR:this.modal.modal_2.form.value.id,
					JUMLAH:this.modal.modal_2.form.value.update,
					JENIS:this.modal.modal_2.form.value.jenis,
					KETERANGAN:this.modal.modal_2.form.value.keterangan,
				};
				//this.postEmbed(this.activeView,data,"transaksi",data._id);
				this.globalService.postData("transaksi",[data]).subscribe(x=>{

				});
				this.modal.modal_2.closeModal();
			},
		},
		modal_3:{
			openModal:()=>{
				this.modal.modal_3.modalRef=this.modalService.open(this.modal_3);
				this.modal.modal_3.isReadyToSubmit=true;
				this.modal.modal_3.form=this.fb.group({
					formNama:["",[GlobalValidator.required]],
					formSupplier:["",[GlobalValidator.required]],
					formQty:[0,[GlobalValidator.number,GlobalValidator.required,GlobalValidator.cantBeZero]],
					formStn:["",[GlobalValidator.required,GlobalValidator.string]],
					formKategori:["",[GlobalValidator.required]],
					formCtn:[0,[GlobalValidator.number,GlobalValidator.required]],
				},{});
				let form=this.modal.modal_3.form;
				let formNamaValue=form.get("formNama");
				let formSupplierValue=form.get("formSupplier");
				let formQtyValue=form.get("formQty");
				let formStnValue=form.get("formStn");
				let formKategoriValue=form.get("formKategori");
				let formCtnValue=form.get("formCtn");
				
				formNamaValue.valueChanges.subscribe((x:string)=>console.log(x))
				formSupplierValue.valueChanges.subscribe((x:string)=>console.log(x))
				formQtyValue.valueChanges.subscribe((x:number)=>{
					console.log(this.modal.modal_3.form.controls.formQty);
				});
				formStnValue.valueChanges.subscribe((x:string)=>console.log(x))
				formKategoriValue.valueChanges.subscribe((x:string)=>console.log(x))
				formCtnValue.valueChanges.subscribe((x:number)=>console.log(x))
				this.activeModal='modal_3';
				
			},
			isReadyToSubmit:true,
			closeModal:()=>{
				this.modal.modal_3.modalRef.close();
				this.activeModal='';
			},
			data:{},
			form:{},
			submit:()=>{
				if(this.modal.modal_3.isReadyToSubmit===false)return console.log("IS_NOT_READY_EXCEPTION ")
				this.modal.modal_3.isReadyToSubmit=false;
				//this.gridOptions.rowData=null;
				let form=this.modal.modal_3.form;
				form.markAllAsTouched()
				form.updateValueAndValidity()
				if(!!form.valid){
					console.log('FORM IS VALID ');
					console.log('form = >',form);
					let reqVar={
						NAMA:form.value.formNama,
						SUPPLIER:form.value.formSupplier,
						QTY:form.value.formQty,
						STN:form.value.formStn,
						KATEGORI:form.value.formKategori,
						CTN:form.value.formCtn,
					};
					this.globalService.postData(
							'stock',
							[reqVar]
						).subscribe((x:any)=>{
							if(!!x.body?.success){
								this.modal.modal_3.closeModal();
								if(!!this.offCanvasInstance)this.offCanvasInstance.close();
							}else{
								this.modal.modal_3.isReadyToSubmit=true;
								return alert(x);
							};
					});
				}else return
			},
			modalRef:undefined,
			getStnFilterData:()=>{
				if(this.stock.daftar.stock.filterData['Qty/ Ctn']===undefined)return [];
				return [...new Set(this.stock.daftar.stock.filterData['Qty/ Ctn'].map((item:any)=>item.split(' ')[1]))];
			},
			getDatalist:(pointer:string)=>{
				if(this.stock.daftar.stock.filterData[pointer]===undefined)return [];
				return this.stock.daftar.stock.filterData[pointer];
			},
		},
		modal_4:{
			openModal:(parentData:any)=>{
				//console.log(this.modal.modal_4)
				this.modal.modal_4.modalRef=this.modalService.open(this.modal_4);
				this.modal.modal_4.isReadyToSubmit=true;
				let tableData=this.user.getTableData('stock');
				parentData=tableData.find((item:any)=>item.ID_DAFTAR===parentData.ID_DAFTAR);
				this.modal.modal_4.initialData=parentData;
				if(!!this.modal.modal_4.initialData.STOCK)delete(this.modal.modal_4.initialData.STOCK);
				let initialData=parentData;
				console.log("initialData",initialData);
				this.modal.modal_4.form=this.fb.group({
					form_id:[initialData.ID_DAFTAR],
					formNama:[initialData.NAMA,[GlobalValidator.required]],
					formSupplier:[initialData.SUPPLIER,[GlobalValidator.required]],
					formQty:[initialData.QTY,[GlobalValidator.number,GlobalValidator.required,GlobalValidator.cantBeZero]],
					formStn:[initialData.STN,[GlobalValidator.required,GlobalValidator.string]],
					formKategori:[initialData.KATEGORI,[GlobalValidator.required]],
				},{});
				//console.log("parentId",parentId);
				console.log("tableData",tableData);
				console.log("parentData",parentData);
				let form=this.modal.modal_4.form;
				let formNamaValue=form.get("formNama");
				let formSupplierValue=form.get("formSupplier");
				let formQtyValue=form.get("formQty");
				let formStnValue=form.get("formStn");
				let formKategoriValue=form.get("formKategori");
				this.activeModal='modal_4';
				
			},
			closeModal:()=>{
				this.modal.modal_4.modalRef.close();
				this.activeModal='';
			},
			initialData:{},
			isReadyToSubmit:true,
			data:{},
			form:{},
			resetForm:(initialData?:any|undefined)=>{
				try{
					if(!initialData)initialData=this.modal.modal_4.initialData;
					let form=this.modal.modal_4.form;
					form.get("formNama").setValue(initialData.NAMA);
					form.get("formSupplier").setValue(initialData.SUPPLIER);
					form.get("formQty").setValue(initialData.QTY);
					form.get("formStn").setValue(initialData.STN);
					form.get("formKategori").setValue(initialData.KATEGORI);
					return 
				}catch(e){
					alert('err')
					return
				}
			},
			submit:()=>{
				if(this.modal.modal_4.isReadyToSubmit===false)return console.log("IS_NOT_READY_EXCEPTION ")
				this.modal.modal_4.isReadyToSubmit=false;
				let form=this.modal.modal_4.form;
				let initialData=this.modal.modal_4.initialData;
				//initialData
				form.markAllAsTouched()
				form.updateValueAndValidity()
				if(!!form.valid){
					console.log('FORM IS VALID ');
					console.log('form = >',form);
					let reqVar={
						ID_DAFTAR:form.value.form_id,
						NAMA:form.value.formNama,
						SUPPLIER:form.value.formSupplier,
						QTY:form.value.formQty,
						STN:form.value.formStn,
						KATEGORI:form.value.formKategori,
					};
					console.log('initialData ',this.modal.modal_4.initialData);
					console.log('reqVar =',reqVar);
					if(JSON.stringify(initialData)===JSON.stringify(reqVar)){
						alert("Data Tidak Berubah");
						this.modal.modal_4.isReadyToSubmit=true;
					}else
					this.globalService.putData('stock',[reqVar]).subscribe(x=>{
						console.log("MODAL_4 => ",x);
						//this.modal.modal_1.closeModal();
						this.modal.modal_4.closeModal();
					});
				}else this.modal.modal_4.isReadyToSubmit=true;
			},
			modalRef:undefined,
			getStnFilterData:()=>{
				if(this.stock.daftar.stock.filterData['Qty/ Ctn']===undefined)return [];
				return [...new Set(this.stock.daftar.stock.filterData['Qty/ Ctn'].map((item:any)=>item.split(' ')[1]))];
			},
			getDatalist:(pointer:string)=>this.stock.daftar.stock.filterData[pointer.toUpperCase()],
		},
	};
	get formNama() { return this.modal[this.activeModal].form.get('formNama'); }
	get formSupplier() { return this.modal[this.activeModal].form.get('formSupplier'); }
	get formQty() { return this.modal[this.activeModal].form.get('formQty'); }
	get formStn() { return this.modal[this.activeModal].form.get('formStn'); }
	get formKategori() { return this.modal[this.activeModal].form.get('formKategori'); }
	get formCtn() { return this.modal[this.activeModal].form.get('formCtn'); }
	/// \MODAL ///
	
	/// EXCEL ///
	public _excel={
		postExcel:(dbName:string,data:any)=>{
			this.gridOptions.api?.showLoadingOverlay();
			this.globalService.excelHandler(data).then(x=>{
				let url=new URL ("stock/excelupload",this.options.data.corsConfig.url);
				this.globalService.postExcel(url.toString(),x).subscribe(y=>{
					console.log(y)
					console.log(y.status)
				})
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
		suppressMenu: true,
		//wrapText: true,
		autoHeight: true,  
		getQuickFilterText: function(params) {
			return params.colDef.hide ? '' : 
				params.colDef.field!='NAMA' ? '' : params.value; 
		},
	};
	public getAllAgGridRows=()=>{
		this.gridOptions.api.selectAll();
		let returnVar=this.gridOptions.api.getSelectedRows();
		this.gridOptions.api.deselectAll;
		return returnVar
	};
	public filter:any={
		getCurrentFilter:()=>this.gridOptions.api.getFilterModel(),
		getDefaultFilterParams:()=>{
			let returnedVar:any={};
			Object.entries(GlobalVar.defaultColumnDefs).map((item:any)=>{
				let pointer=item[0];
				let data=item[1].defaultFilterParams;
				returnedVar[pointer]=data;
				console.log("returnedVar[pointer]=data;",returnedVar[pointer]=data)
			});
			return returnedVar;
		},
		setDefaultFilter:(colName:string)=>{
			let defaultFilterParams=this.misc.copy(this.filter.getDefaultFilterParams());
			console.log("this.filter.getDefaultFilterParams();",defaultFilterParams);
			this.misc.setFilterParams(defaultFilterParams);
			this.gridOptions.api.setFilterModel(defaultFilterParams[this.activeView]);
			//this.gridOptions.api.onFilterChanged();
		},
		setFilter:(header:any,filter:any,filterType?:string,type?:string)=>{
			console.log("getCurrentFilter().STOCK?.filter",this.filter.getCurrentFilter().STOCK?.filter);
			console.log('header',header);
			console.log('filter',filter);
			console.log('filterType',filterType);
			console.log('type',type);
			let filterInstance = this.gridOptions.api.getFilterInstance(header); 
			let defaultFilterParams=this.misc.copy(this.filter.getDefaultFilterParams());
			let temp1:any={};
			temp1['filter']=filter;
			if(!filterType){
				if(filterInstance.filterType) return temp1['filterType']=filterInstance.filterType;
				temp1['filterType']=defaultFilterParams[header].filterType;
			} else {
				temp1['filterType']=filterType;
			};
			if(!type){
				if(filterInstance.type) return temp1['type']=filterInstance.type;
				temp1['type']=defaultFilterParams[header].type;
			} else {
				temp1['type']=type;
			};
			let filterParams=this.options.data.filterParams;
			console.log("FILTERPARAMS : ",filterParams);
			filterParams[this.activeView][header]=temp1;
			console.log("debug1",JSON.parse(JSON.stringify(filterParams[this.activeView][header])));
			console.log("debug2",temp1);
			console.log("filterInstance",filterInstance);
			this.misc.setFilterParams(filterParams);
			filterInstance.setModel(temp1);
			this.gridOptions.api.onFilterChanged();
		},
		search:(event:any)=>{
			console.log(event);
			return this.gridOptions.api.setQuickFilter(event.target.value);
		},
	};
	public gridOptions:any= {
		rowData:null,
		suppressCellFocus:true,
		columnDefs:[],
		pagination: true,
		paginationAutoPageSize:false,	
		rowSelection: 'single',
		rowMultiSelectWithClick:true,
		//paginationPageSize:50,	
		accentedSort:true,
		onGridReady:(params:any)=>{
			console.log("grid Event => onGridReady : ");
			window.addEventListener('resize', (event)=>this.adjustTableContainerSize());
		},
		onFirstDataRendered:(event:any)=>{
			console.log("grid Event => onFirstDataRendered : ");
			this.gridOptions.columnApi.autoSizeAllColumns();
			this.adjustTableContainerSize();
			
		},
		onSelectionChanged:(event: any)=>{

		},
		onCellEditingStarted:(event:any)=>{

		},
		onCellEditingStopped:(event:any)=>{

		},
		onPaginationChanged:(params:any)=>{

		},
		onRowDataUpdated:async(event:any)=>{
			console.log("grid Event => onRowDataUpdated : ");
		},
		onFilterChanged:(event:any)=>{
			console.log("grid Event => onFilterChanged : ");
		},
		onColumnResized: (event:any) => {
			this.adjustTableContainerSize();
		},
		onModelUpdated: (event:any)=>{

		},
		onComponentStateChanged:(event:any)=>{

		},
		onColumnVisible:(event:any)=>{
			console.log("grid Event => onColumnVisible : ");
			this.gridOptions.columnApi.autoSizeAllColumns();
			this.adjustTableContainerSize();
		},
		onRowDoubleClicked:(event:any)=>{
			console.log("grid Event => onRowDoubleClicked : ");
			this.operation.mode[this.operation.active].gridOptions.onRowDoubleClicked(event);
		}
	};
	public gridApi:any;//initialize at gridOptions.onGridReady
	public tableContainerStyle:{width:string,height:string}={width:'auto',height:'0px'};
	public adjustTableContainerHeight=()=>{
	
	};
	public adjustTableContainerSize=()=>{
		console.log("dataTable event => this.adjustContainerSize()");
		let navbarHeight=document.getElementById("mainNavbar")?.clientHeight;
		if(navbarHeight===undefined)navbarHeight=0;
		////////////////////////////////////////////
		let container=document.getElementById("gridTable")!;
		let containerRect=container.getBoundingClientRect();
		let containerRectTop=containerRect.top;
		////////////////////////////////////////////
		let innerTable=document.querySelectorAll('[class="ag-theme-alpine"]')[0];
		let innerTableRect=innerTable?.getBoundingClientRect();
		let innerTableRectRight:number=0;;
		if(!!innerTableRect?.right)innerTableRectRight=innerTableRect.right;
		/////////////////////////////////////////////
		let scrollBar=document.querySelectorAll('[Class=ag-body-vertical-scroll-viewport]')[0];
		let scrollBarRect=scrollBar?.getBoundingClientRect();
		let scrollBarRectWidth=scrollBarRect?.width;
		//scrollBarRectWidth=0
		let horizontalScrolbarBuffer=10;
		let pinnedColumn=["STOCK",'NAMA'];
		//let pinnedColumnTotalWidth=this.misc.getPinnedColumnWidth(pinnedColumn);

		let allColumnWidth=this.gridOptions.columnApi.getColumns().map((item:any)=>{
			let temp=item.colDef;
			console.log("item.colDef",item.colDef);
			if(!!item.visible)return item.getActualWidth();
			return 0;
		}).reduce((a:number,b:number)=>a+b,0);
		let wrapper1=document.getElementById("wrapper1")?.clientHeight;
		console.log("allColumnWidth",allColumnWidth);
		//////////////////////////////////////////////
		if(!!innerTable){
			let innerTableWidth=innerTable.getBoundingClientRect().width;
			let windowWidth=window.innerWidth;
			let width="50%";
			let height:any="100%";
			if(allColumnWidth>=windowWidth){
				width=(windowWidth-20).toString()+'px';
			}else{
				if(allColumnWidth===0) width='100%'
				//else width=(innerTableRectRight+scrollBarRectWidth)+"px";
				else width=(allColumnWidth+scrollBarRectWidth+horizontalScrolbarBuffer).toString()+'px';
			};
			let tempHeight=(window.innerHeight-navbarHeight);		
			height=22*Math.floor(tempHeight/22);
			let temp={
				width:width,
				height:height+horizontalScrolbarBuffer+'px',
			};
			if(JSON.stringify(this.tableContainerStyle)===JSON.stringify(temp))return
			this.tableContainerStyle=temp;
			//console.log("height ",height);
			//console.log("22*Math.floor((height-navbarHeight)",Math.floor(((height-navbarHeight)/22)-1));
			console.log("navbarHeight => ",navbarHeight);
			console.log("tempHeight => ",tempHeight);
			console.log("window.innerHeight => ",window.innerHeight);
			console.log("aaa0",this.gridOptions.api.paginationSetPageSize(Math.floor(((height-navbarHeight)/22)-1)));
		};		
	};
	/// \AG-GRID ///
	
	setView=(viewName:string)=>{
		console.log("SET_VIEW => ",viewName,this.options.setOptions(viewName,"activeView"));
		this.activeView=viewName;
		this.refreshPage();
	};
	setDbKey=(dbKey:number)=>{
		let temp=this.user.setDbKey(dbKey);
		console.log("set db key ", temp);
		this.globalService.setHeaders("dbKey",temp.toString());
	};
	post=(data:Array<any>)=>{
		let temp=this.gridOptions.rowData;
		this.gridOptions.rowData=null;
		//this.globalService.postData(this.activeView,data).subscribe(x=>console.log("SUBSCRIBE",x));
		this.globalService.postData(this.activeView,data).subscribe(x=>{
			console.log("POST_NEXT => ",x);
			this.gridOptions.rowData=temp;
			return x;

		});
	};
	postEmbed=(dbName:string,data:any,embedName:string|undefined,id:string|undefined)=>{
		this.globalService.postEmbedData(dbName,data,embedName,id).subscribe(x=>console.log("do postEmbed, awaiting response..",dbName,data,embedName,id));
	};
	delete=(data:any,dbName:string)=>{
		if(!Array.isArray(data))throw new Error ('Expected Array');	
		let confirmed:boolean=false;
		let idArr:any;
		if(Array.isArray(data))idArr=data.map(item=>item.ID_DAFTAR);
		//if(!dbName)dbName=this.activeView;
		if(data.length===this.gridOptions.rowData.length){
			confirmed=confirm(GlobalVar.alert([],"Hapus Semua Data ?"));
		}else{
			confirmed=confirm(GlobalVar.alert(data,"Hapus Data ?"));
		};
		if(!!confirmed){
			this.misc.loadingWrapper(
				()=>{
					this.globalService.deleteData(dbName,idArr).subscribe({
						next:(x)=>{
							console.log("DELETE_NEXT");
						},
						complete:()=>{
							console.log("DELETE_COMPLETE");
						},
						error:(e) => {
							alert(GlobalVar.alert([{name:e.name},{message:e.message}],e.statusText));
						},
					});
				},this.gridOptions
			);
		};
	};
	public misc={
		copy:(x:any)=>JSON.parse(JSON.stringify(x)),
		showHiddenColumn:(columnName:string,value:boolean)=>{
			//console.log("columnName",columnName);
			//console.log("value",value);
			let tableOptions=this.options.data.tableOptions;
			//console.log(tableOptions);
			tableOptions[this.activeView].columnDefs.find((item:any)=>item.field===columnName).hide=value;
			//console.log('tableOptions',tableOptions);
			this.options.setOptions(tableOptions,'tableOptions');
		},
		toUpperCase:(x:string)=>{
			let temp="";
			if(!x)return "";
			temp=x.toUpperCase();
			return temp;
		},
		prompt:(text:string)=>{
			//if(this.user.prompt)true
		},
		loadingWrapper:async(_f:any,gridOptions:any,_var?:any)=>{
			console.log("loadingWrapper _var",gridOptions);
			gridOptions.api.showLoadingOverlay();
			//this.gridOptions.api.setRowData(null);
			if(!!_var)return await _f(_var);
			return await _f();
		},
		closeAllModals:()=>console.log(this.offcanvasService),
		convertDate:(dateString:string)=>{
			let temp=new Date(dateString).toLocaleString('id');
			return temp;
		},
		checkAdm:()=>{
			return !!GlobalVar.config.adm.find(item=>item===this.user.name);
		},
		setFilterParams:(filterObj:any)=>{
			console.log("setFilterParams:(filterObj)",filterObj)
			Object.keys(filterObj).map(pointer=>{
				//this.stock.setFilterParams(filterObj[pointer],pointer);
			});
			this.options.setOptions(filterObj,"filterParams");
			console.log("options.filterParams",this.options.data.filterParams);
		},
		getDefaultFilterObj:()=>{
			let returnedVar:any={};
			Object.entries(GlobalVar.defaultColumnDefs).map((item:any)=>{
				let pointer=item[0];
				let data=item[1].defaultFilterParams;
				returnedVar[pointer]=data;
				console.log("returnedVar[pointer]=data;",returnedVar[pointer]=data)
			})
			return returnedVar;
		},
		getPinnedColumnWidth:(colArrStr:Array<any>)=>{
			let width=0;
			colArrStr.map(item=>{
				width+=this.gridOptions.columnApi.getColumn(item).getActualWidth()|0;
			});
			return width;
		},
		testAlert:(text:string)=>alert(text),
	};
	public changeView=(view:string)=>{
		//console.log("===>changeView ",view);
		//console.log("this.stock.daftar[view].colDef ",this.stock.daftar[view].colDef);
		if(this.activeView===view){
			console.log("changeView literally do NOTHING");
		}else{
			this.activeView=view;

		};
		this.gridOptions.api?.deselectAll();
		this.gridOptions.api?.setColumnDefs(this.options.data.tableOptions[view].columnDefs);
		//console.log("this.options.data.this.options.data.tableOptions[this.activeView].defaultFilterParams.defaultFilterParams",this.options.data.tableOptions[this.activeView].defaultFilterParams);
		//console.log("this.stock.daftar[view].defaultFilterParam ",this.stock.daftar[view].defaultFilterParams);
		this.gridOptions.api?.setFilterModel(this.options.data.filterParams[view]);
	};
	public updateData=async(tableData:any)=>{
		//console.log("UPDATE DATA",tableData);
		let returnVal=this.stock.set(tableData,this.activeView,this.options.data.tableOptions);
		this.changeView(this.activeView);
		return returnVal;
	};
	private getPage=()=>{
		this.globalService.getData(this.activeView).subscribe((x:any)=>{
			x.data.map((item:any)=>item.STOCK=Number(item.STOCK));
			let temp=this.user.setTableData(this.user.getDbKey(),x.data,this.activeView);
			this.updateData(temp);
		});
	};
	public refreshPage=()=>{
		console.log("checkDbParity=()=> Start");
		try{
			let tableName=this.activeView;
			let tableData=this.user.getTableData(tableName)
			console.log("checkDbParity=()=> tableData : ",tableData);
			if(!tableData||tableData.length<1){
				this.globalService.getDbKey().subscribe((x:any)=>{
					console.log("checkDbParity=()=> dbCheckParity Failed");
					this.setDbKey(x.value);
					this.getPage();
				});
			}else{
				this.globalService.getDbKey().subscribe((x:any)=>{
					let clientKey=this.user.getDbKey();
					let dbKey=Number(x.value);
					console.log("checkDbParity=()=> dbKey : ",clientKey===dbKey,clientKey,dbKey);
					if (clientKey===dbKey){
						console.log("checkDbParity=()=> dbCheckParity Success");
						this.getPage();
					}else {
						console.log("checkDbParity=()=> dbCheckParity Failed");
						this.setDbKey(x.value);
						this.getPage();
					};
				});
			};
		}catch(e){
			console.log("checkDbParity=()=> dbCheckParity Error : ",e);
		};
	};
	public old_refreshPage=()=>{
		console.log("checkDbParity=()=> Start");
		try{
			let tableName=this.activeView;
			let tableData=this.user.getTableData(tableName)
			let returnedVar;
			console.log("checkDbParity=()=> tableData : ",tableData);
			if(!tableData||tableData.length<1){
				this.globalService.getDbKey().subscribe((x:any)=>{
					console.log("checkDbParity=()=> dbCheckParity Failed");
					this.setDbKey(x.value);
					this.getPage();
				});
			}else{
				this.globalService.getDbKey().subscribe((x:any)=>{
					let clientKey=this.user.getDbKey();
					let dbKey=x.value;
					console.log("checkDbParity=()=> dbKey : ",clientKey===dbKey,clientKey,dbKey);
					if (clientKey===dbKey){
						console.log("checkDbParity=()=> dbCheckParity Success");
						this.getPage();
					}else {
						console.log("checkDbParity=()=> dbCheckParity Failed");
						this.setDbKey(x.value);
						this.getPage();
					};
				});
			};
		}catch(e){
			console.log("checkDbParity=()=> dbCheckParity Error : ",e);
		};
	};
	/*
	public old_refreshPage=()=>{
		let temp=this.checkDbParity();
		console.log("parity temp =<",temp);
		if(temp){
			console.log("refreshPage true")
			this.getPage();
		}else{
			console.log("refreshPage false")
			this.globalService.getDbKey().subscribe((x:any)=>{
				console.log("x.value,this.user.getDbKey()",x.value,this.user.getDbKey())
				this.setDbKey(x.value);
				this.getPage();
			});
		};
	};
	*/
}
