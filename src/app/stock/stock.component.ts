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
import { GlobalValidator } from '../shared/formValidator';
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
	public stock=new GlobalVar.stock();
	public user=new GlobalVar.user(localStorage.getItem('name'));
	public viewArr=Object.keys(this.stock.stock);
	public activeView:any=this.viewArr[0];//public activeView=this.viewArr[1];
	//public operation:any={}
	public operation:any={
		mode:{
			view:{
				gridOptions:{
					onRowDoubleClicked:(event:any)=>{
						let activeView=this.activeView;
						if(activeView==='daftar')return this.modal.modal_1.openModal(event.data);
						if(activeView==='transaksi')return alert(GlobalVar.alert(event.data));
					},
				},
			},
			edit:{
				gridOptions:{
					onRowDoubleClicked:(data:any)=>{
						let activeView=this.activeView;
						let parentId=data.data._id;					
						if(activeView==='daftar')return this.modal.modal_4.openModal(parentId);
					},
				},
			},
			delete:{
				gridOptions:{
					onRowDoubleClicked:(event:any)=>{
						let activeView=this.activeView;
						console.log(event.data);
						if(activeView==='daftar')return this.delete([event.data],'daftar');
						//if(activeView==='transaksi')return this.delete(event.data,activeView);
						return
					},
				},
				selectedData:null,
				deleteFunction:(data:any)=>{
					let activeView=this.activeView;
					if(activeView==='daftar')return this.delete(data,'daftar');
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
	public lastRequest:any;
	constructor(){
		this.navigationPages=GlobalVar.pages;
		this.operation.active=Object.keys(this.operation.mode)[0];
	};
	ngOnInit(){
		//console.log("this socket",this.socket)
		
		this.socket.on("debug",(arg1:any)=>{
			console.log("debug : ",arg1);
		});
		this.socket.on("login",(arg1:any,arg2:any)=>{
			console.log("login : ",arg1);
			arg2({status:"ok"});
		});
		this.socket.on("connect", () => {
			console.log("socket connected, socket : ");
			this.socket.emit("login",this.dbKey,(response:any)=>console.log(response));
		});
		this.socket.on("delete",(emittedData:any)=>{
			console.log("EMIT RECEIVED: DELETE =>",emittedData);
			let message=emittedData.message;
			let deletedDataId=emittedData.deletedDataId;
			let oldData=this.stock.raw;
			let alertArr:Array<any>=[];
			let deletedData = oldData.filter((item)=>deletedDataId.includes(item.ID_DAFTAR));
			console.log(deletedData);
			deletedData.map((item:any)=>{
				alertArr.push({
					id:item.ID_DAFTAR,
					Nama:item.NAMA,
					Supplier:item.SUPPLIER,
				});
			});
			alert(GlobalVar.alert(alertArr,message));
			this.updateData(this.stock.deleteById(deletedDataId));
		});
		this.socket.on("get",(emittedData:any)=>{
			alert('get emit');
			console.log("emittedData : ",emittedData);
			console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
		});
		this.socket.on("init",(emittedData:any)=>{
			console.log("EMIT RECEIVED: INIT =>",emittedData);
			let data=emittedData.data;
			let message=emittedData.message;
			let alertArr:Array<any>=[];
			data.map((item:any)=>{
				alertArr.push({
					id:item.ID_DAFTAR,
					Nama:item.NAMA,
					Supplier:item.SUPPLIER,
				});
			});
			alert(GlobalVar.alert(alertArr,message));
			this.updateData(data);
		});
		this.socket.on("post",(emittedData:any)=>{
			console.log("EMIT RECEIVED: POST =>",emittedData);
			let data=emittedData.data;
			let message=emittedData.message;
			let oldData=this.stock.raw;
			let alertArr:Array<any>=[];
			data.map((item:any)=>{
				alertArr.push({
					id:item.ID_DAFTAR,
					Nama:item.NAMA,
					Supplier:item.SUPPLIER,
				});
			});
			alert(GlobalVar.alert(alertArr,message));
			let newAndUpdatedData=oldData;
			newAndUpdatedData.push(...data);
			this.updateData(newAndUpdatedData);
		});
		/*this.socket.on("__1", (arg1:{
			data:any[],
			request:string,
			message:string,
			dbKey:string,
		}) => {
			//console.log('arg1 : ',arg1)
			let emitRequest=arg1.request;
			let alertArr:Array<any>=[];
			let data:any=null;
			let oldData:Array<any>=this.stock.raw;
			//let oldDataIndex:number=-1;
			//let deletedData:any;
			let newData:any;
			//let temp:Array<any>=[];
			console.log("emitRequest=",emitRequest);
			console.log("arg1=",arg1);
			if(!emitRequest)this.get(this.currentPage);else
			this.getDbKey(arg1.dbKey);
			data=arg1.data;
			data.map((item:any)=>{
				alertArr.push({
					nama:item.nama,
					supplier:item.supplier,
					kategori:item.kategori,
				});
			});
			alert(GlobalVar.alert(alertArr,arg1.message));
			if(oldData.length<1)return this.refreshPage();
			newData=data;
			switch(emitRequest){
				case 'add_few':
					
					break;
				case 'add':
					console.log('receive emit request "add" : ',arg1,
					(()=>{
						oldData.push(...newData);
						this.updateData(oldData);
					})());
					break;
				case 'add_transaksi':
					console.log('receive emit request "add_transaksi" : ',arg1,
					(()=>{
						let index:any='';
						data.map((item:any)=>{
						index=oldData.map(item2=>item2._id);
						index=index.findIndex((item3:any)=>item3===item._id);
							oldData[index].transaksi=item.transaksi;
						});
						this.updateData(oldData);
					})());
					break;
				case 'update':
					console.log('receive emit request "update" : ',arg1,
					(()=>{
						let data=arg1.data[0];
						[data].map((item:any)=>{
							alertArr.push({
								nama:item.nama,
								supplier:item.supplier,
								kategori:item.kategori,
							});
						});
						let oldDataIndex=oldData.findIndex(item=>item._id===data._id);
						Object.keys(data).map(pointer=>{
							if(data[pointer]===oldData[oldDataIndex][pointer])return
							oldData[oldDataIndex][pointer]=data[pointer];
						});
						this.updateData(oldData);
					})());
					break;
				case 'delete':
					console.log('receive emit request "delete" : ',arg1,
					(()=>{
						let deletedData=data;
						let oldDataId=oldData.map(item=>item._id);
						let deletedDataId=deletedData.map((item:any)=>item._id);					
						let temp=oldData.filter((item:any)=>!deletedDataId.includes(item._id));
						console.log('empty Delete',temp);
						this.updateData(temp)
					})());
					break;
				case 'delete_embed':
					console.log('receive emit request "delete_embed" : ',arg1,
					(()=>{
						let data=arg1.data[0];
						alertArr.push({
							nama:data.nama,
							supplier:data.supplier,
							kategori:data.kategori,
						});
						let parentId=data._id;
						let oldDataIndex=oldData.findIndex(item=>item._id===parentId);
						oldData[oldDataIndex].transaksi=data.transaksi;
						let temp=oldData;		
						this.updateData(temp)
					})());
					break;
				case 'update_key':
					this.getDbKey(arg1.dbKey);
				break;
				case 'init':
					console.log('receive emit request "init" : ',arg1,
					(()=>{
						if(arg1.dbKey != this.dbKey || oldData.length<1){
							this.getDbKey(arg1.dbKey);
							this.refreshPage();
						};
					})());
					break;
				default :
						
				return
			};	
		});*/
		this.debugThis=this;
		//this.get(this.currentPage);
	};
	
	/// OFFCANVAS ///
	private offcanvasService:NgbOffcanvas=inject(NgbOffcanvas);
	public _offCanvas={
		open:(content:any)=>this.offcanvasService.open(content),
	};
	/// \OFFCANVAS ///
	
	/// USER ///


	/// \USER ///
	
	/// MODAL ///
	public modalService:NgbModal=inject(NgbModal);
	@ViewChild('modal_1') modal_1!:DynamicModalComponent;//modal daftar
	@ViewChild('modal_2') modal_2!:DynamicModalComponent;//modal transaksi
	@ViewChild('modal_3') modal_3!:DynamicModalComponent;//modal add daftar
	@ViewChild('modal_4') modal_4!:DynamicModalComponent;//modal edit daftar
	public activeModal:string='';
	public modal:any={
		modal_1:{
			openModal:(modalData:any)=>{
				this.modal.modal_1.data=modalData;
				this.modal.modal_1.modalRef=this.modalService.open(this.modal_1);
				this.globalService.getData('stock/transaksi',[modalData.ID_DAFTAR]).subscribe(x=>this.modal.modal_1.transactionData=x);
			},
			closeModal:()=>{
			
				this.modal.modal_1.modalRef.close();
			},
			transactionData:[],
			getTransactionData:(id:Array<number>)=>{
				return this.globalService.getData('transaksi',id).subscribe(x=>x);
			},
			data:{},
			modalRef:undefined,
			innerTable:{
				defaultColumnDefs:{
					ID_TRANSAKSI:{
						headerName:'Id',
					},
					PERUBAHAN:{
						headerName:'Perubahan',
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
			closeModal:()=>{
				this.modal.modal_3.modalRef.close();
				this.activeModal='';
			},
			data:{},
			form:{},
			submit:()=>{
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
					console.log(
						"POST",
						this.globalService.postData(
							this.currentPage,
							[reqVar]
						).subscribe((x:any)=>{
						if(!!x.body?.success)return this.modal.modal_3.closeModal();
						return alert(x);
					}));
				}else return
			},
			modalRef:undefined,
			getStnFilterData:()=>{
				if(this.stock.stock.daftar.filterData['Qty/ Ctn']===undefined)return [];
				return [...new Set(this.stock.stock.daftar.filterData['Qty/ Ctn'].map((item:any)=>item.split(' ')[1]))];
			},
			getDatalist:(pointer:string)=>{
				if(this.stock.stock.daftar.filterData[pointer]===undefined)return [];
				return this.stock.stock.daftar.filterData[pointer];
			},
		},
		modal_4:{
			openModal:(parentId:string)=>{
				console.log(this.modal.modal_4)
				let parentData=this.stock.raw.find((item:any)=>item._id===parentId);
				this.modal.modal_4.modalRef=this.modalService.open(this.modal_4);
				this.modal.modal_4.initialData=parentData;
				let initialData=parentData;
				this.modal.modal_4.form=this.fb.group({
					form_id:[initialData._id],
					formNama:[initialData.nama,[GlobalValidator.required]],
					formSupplier:[initialData.supplier,[GlobalValidator.required]],
					formQty:[initialData.qty,[GlobalValidator.number,GlobalValidator.required,GlobalValidator.cantBeZero]],
					formStn:[initialData.stn,[GlobalValidator.required,GlobalValidator.string]],
					formKategori:[initialData.kategori,[GlobalValidator.required]],
				},{});
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
			data:{},
			form:{},
			resetForm:(initialData?:any|undefined)=>{
				try{
					if(!initialData)initialData=this.modal.modal_4.initialData;
					let form=this.modal.modal_4.form;
					form.get("formNama").setValue(initialData.nama);
					form.get("formSupplier").setValue(initialData.supplier);
					form.get("formQty").setValue(initialData.qty);
					form.get("formStn").setValue(initialData.stn);
					form.get("formKategori").setValue(initialData.kategori);
					return 
				}catch(e){
					alert('err')
					return
				}
			},
			submit:()=>{
				let form=this.modal.modal_4.form;
				form.markAllAsTouched()
				form.updateValueAndValidity()
				if(!!form.valid){
					console.log('FORM IS VALID ');
					console.log('form = >',form);
					let reqVar={
						_id:form.value.form_id,
						nama:form.value.formNama,
						supplier:form.value.formSupplier,
						qty:form.value.formQty,
						stn:form.value.formStn,
						kategori:form.value.formKategori,
					};
					console.log('reqVar =',reqVar);
					console.log('reqVar :',this.put(form.value.form_id,[reqVar]));
				}else return
			},
			modalRef:undefined,
			getStnFilterData:()=>[...new Set(this.stock.stock.daftar.filterData['Qty/ Ctn'].map((item:any)=>item.split(' ')[1]))],
			getDatalist:(pointer:string)=>this.stock.stock.daftar.filterData[pointer],
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
				console.log("Excel : ", x)
				this.globalService.postExcel(GlobalVar.dbServerUrl+"stock/excelupload",x).subscribe(y=>{
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
		getQuickFilterText: function(params) {
			return params.colDef.hide ? '' : 
				params.colDef.field!='NAMA' ? '' : params.value; 
		}
	};	
	public getAllAgGridRows=()=>{
		this.gridOptions.api.selectAll();
		let returnVar=this.gridOptions.api.getSelectedRows();
		this.gridOptions.api.deselectAll;
		return returnVar
	};
	public filter:any={
		getCurrentFilter:()=>this.gridOptions.api.getFilterModel(),
		getDefaultFilterParam:()=>this.stock.stock[this.activeView].defaultFilterParam,
		setFilter:(header:any,filter:any,filterType?:string,type?:string)=>{
			console.log('header',header);
			console.log('filter',filter);
			console.log('filterType',filterType);
			console.log('type',type);
			let filterInstance = this.gridOptions.api.getFilterInstance(header); 
			let defaultFilterParam=this.stock.stock[this.activeView].defaultFilterParam;
			let temp1:any={};
			temp1['filter']=filter;
			if(!filterType){
				if(filterInstance.filterType) return temp1['filterType']=filterInstance.filterType;
				temp1['filterType']=defaultFilterParam[header].filterType;
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
			console.log(event);
			return this.gridOptions.api.setQuickFilter(event.target.value);
		},
	};
	public gridOptions:any= {
		rowData:null,
		columnDefs:[],
		pagination: true,
		paginationAutoPageSize:false,	
		rowSelection: 'single',
		rowMultiSelectWithClick:true,
		paginationPageSize:50,	
		accentedSort:true,
		onGridReady:(params:any)=>{
			console.log("grid Event => onGridReady : ");
			this.gridApi=this.gridOptions.api;	
			this.gridOptions.api?.setColumnDefs(this.stock.stock[this.activeView].colDef);
			//console.log("HIDE LOADING : ",this.gridOptions.api?.hideOverlay());
			//this.gridOptions.api?.showLoadingOverlay();
		},
		onFirstDataRendered:(event:any)=>{
			console.log("grid Event => onFirstDataRendered : ");
			//console.log("HIDE LOADING : ",	this.gridOptions.api?.hideOverlay());
			this.gridOptions.columnApi.autoSizeAllColumns();
			this.adjustTableContainerSize()
		},
		onSelectionChanged:(event: any)=>{

		},
		onCellEditingStarted:(event:any)=>{

		},
		onCellEditingStopped:(event:any)=>{

		},
		onPaginationChanged:(params:any)=>{

		},
		onRowDataUpdated:(event:any)=>{
			console.log("grid Event => onRowDataUpdated : ");
			if(this.activeView==='daftar'){
				this.gridOptions.columnApi.applyColumnState({
					state: [{ colId: 'nama', sort: 'asc' }],
					defaultState: { sort: null },
				});
			}else if(this.activeView==='transaksi'){
				this.gridOptions.columnApi.applyColumnState({
					state: [{ colId: 'tanggal', sort: 'desc' }],
					defaultState: { sort: null },
				});
			}
		},
		onFilterChanged:(event:any)=>{

		},
		onColumnResized: (event:any) => {

		},
		onModelUpdated: (event:any)=>{
			this.gridOptions.columnApi.autoSizeAllColumns();
			this.adjustTableContainerSize()
			
		},
		onComponentStateChanged:(event:any)=>{

		},
		onColumnVisible:(event:any)=>{
			console.log("grid Event => onColumnVisible : ");
			this.gridOptions.columnApi.autoSizeAllColumns();
			this.adjustTableContainerSize()
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
		scrollBarRectWidth=15
		//////////////////////////////////////////////
		if(!!innerTable){
			let innerTableWidth=innerTable.getBoundingClientRect().width;
			let windowWidth=window.innerWidth;
			let width="50%";
			let height:any="100%";
			console.log("innerTableWidth>=windowWidth",innerTableWidth,windowWidth)
			if(innerTableWidth>=windowWidth){
				width="auto";
			}else{
				if(innerTableWidth===0) width='50%'
				else width=(innerTableRectRight+scrollBarRectWidth)+"px";
			};
			let marginBottom:number=0;
			let tempHeight=(window.innerHeight-containerRectTop+window.scrollY)+marginBottom;
			height=22*Math.floor(tempHeight/22)+11;
			let temp={
				width:width,
				height:height+'px',
			};
			if(JSON.stringify(this.tableContainerStyle)===JSON.stringify(temp))return
			this.tableContainerStyle=temp;
			console.log("innerTableRectRight",innerTableRectRight);
			console.log("scrollBarRectWidth",scrollBarRectWidth);
			console.log("tableWidth",width);
			console.log("aaa0",this.gridOptions.paginationPageSize=(22*Math.floor((height-navbarHeight)/22)/22));
		};		
	};
	public changeView=(view:string)=>{
		this.activeView=view;
		this.gridOptions.api?.deselectAll();
		this.gridOptions.api?.setColumnDefs(this.stock.stock[view].colDef);
		this.gridOptions.api?.setFilterModel(this.stock.stock[view].defaultFilterParam);

	;
		//console.log("HIDE LOADING : ",	this.gridOptions.api?.hideOverlay());
		
	};
	/// \AG-GRID ///
	
	rw=(request:any)=>{
		console.log("Request",request);
		return request().subscribe((x:any)=>{
			if (!!x.ERR) return alert(x.ERR.message);
			if (!!x.dbKey){
				let dbKey=x.dbKey.toString();
				this.getDbKey(dbKey);
				return this.rw(()=>request());
			}else this.updateData(x);
		});
	};
	getDbKey=(dbKey:number)=>{
		GlobalVar.dbKey=dbKey;
		console.log("set db key "+JSON.stringify(GlobalVar.dbKey));
		this.globalService.setHeaders("dbKey",dbKey.toString());
	};
	get=(dbName:string,id?:Array<number> | undefined)=>{
		//console.log("SHOW LOADING : ",this.gridOptions.api?.showLoadingOverlay());
		//let dbName=this.currentPage;
		this.globalService.getData(dbName,id).subscribe({
			next:(x)=>{
				console.log("GET_NEXT");
				return this.updateData(x);
			},
			complete:()=>{
				console.log("GET_COMPLETE");
				//console.log("HIDE LOADING : ",this.gridOptions.api?.hideOverlay());
			},
		});
	};
	post=(data:Array<any>)=>{
		let temp=this.gridOptions.rowData;
		this.gridOptions.rowData=null;
		//this.globalService.postData(this.currentPage,data).subscribe(x=>console.log("SUBSCRIBE",x));
		this.globalService.postData(this.currentPage,data).subscribe(x=>{
			console.log("POST_NEXT => ",x);
			this.gridOptions.rowData=temp;
			return x;

		});
	};
	put=(id:number,data:Array<any>)=>{
		let dbName=this.currentPage;
		this.globalService.putData(dbName,id,data).subscribe(x=>console.log("do put, awaiting response..",{dbName:dbName,id:id,data:data}))
	};
	public updateData=(x:any)=>{
		console.log("UPDATE DATA",x);
		let returnVal=this.stock.set(x);
		this.changeView(this.activeView);
		return returnVal;
	};
	postEmbed=(dbName:string,data:any,embedName:string|undefined,id:string|undefined)=>{
		this.globalService.postEmbedData(dbName,data,embedName,id).subscribe(x=>console.log("do postEmbed, awaiting response..",dbName,data,embedName,id));
	};
	delete=(data:any,dbName?:string,embedName?:string|undefined)=>{

		if(!Array.isArray(data))throw new Error ('Expected Array');	
		let confirmed:boolean=false;
		let idArr:any;
		if(Array.isArray(data))idArr=data.map(item=>item.ID_DAFTAR);
		if(!dbName)dbName=this.currentPage;
		if(data.length===this.gridOptions.rowData.length){
			confirmed=confirm(GlobalVar.alert([],"Hapus Semua Data ?"));
		}else{
			confirmed=confirm(GlobalVar.alert(data,"Hapus Data ?"));
		};
		if(!!confirmed){
			//this.gridOptions.api.showLoadingOverlay();
			let temp=this.gridOptions.rowData;
			this.gridOptions.rowData=null;
			this.globalService.deleteData('stock/'+dbName,idArr,embedName,data[0]._idDaftar).subscribe({
				next:(x)=>{
					console.log("DELETE_NEXT")
					
				},
				complete:()=>{
					console.log("DELETE_COMPLETE");
					this.gridOptions.rowData=temp;
					//console.log("HIDE LOADING : ",this.gridApi?.hideOverlay());
				},
				error:(e) => {
					alert(GlobalVar.alert([{name:e.name},{message:e.message}],e.statusText));
					this.refreshPage();
				},
			});
		};
	};
		  
	public refreshPage=()=>{
		this.get(this.currentPage);
		this.gridOptions.api?.hideOverlay();
		this.gridOptions.api?.deselectAll;
	};
}
