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
	
	public stock=new GlobalVar.stock([]);
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
					onRowDoubleClicked:(event:any)=>{
						let activeView=this.activeView;
						let parentId=event.data._id;
						
						if(activeView==='daftar')return this.modal.modal_4.openModal(parentId);
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
					let activeView=this.activeView;
					if(activeView==='daftar')return this.delete(data);
					if(activeView==='transaksi')return this.delete(data,activeView);
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
			let data:any=null;
			let oldData:Array<any>=[];
			let deletedData:any;
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
					data=arg1.data[0];
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
					deletedData=data;
					let oldDataId=oldData.map(item=>item._id);
					let deletedDataId=deletedData.map((item:any)=>item._id);					
					temp=oldData.filter((item:any)=>!deletedDataId.includes(item._id));
					console.log('empty Delete',temp);
					this.stock.set(temp);
					this.changeView(this.activeView);
					break;
				case 'delete_embed':
					data=arg1.data[0];
					alertArr.push({
						nama:data.nama,
						supplier:data.supplier,
						kategori:data.kategori,
					});
					alert(GlobalVar.alert(alertArr,arg1.message));
					this.getDbKey(arg1.dbKey);
					oldData=this.stock.raw;
					let parentId=data._id;
					let oldDataIndex=oldData.findIndex(item=>item._id===parentId);
					oldData[oldDataIndex].transaksi=data.transaksi;
					console.log(data);
					console.log(oldData);
					console.log(oldDataIndex);
					temp=oldData;
					
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
				
				this.modal.modal_3.form=this.fb.group({
					formNama:["",[GlobalValidator.required]],
					formSupplier:["",[GlobalValidator.required]],
					formQty:[0,[GlobalValidator.number,GlobalValidator.required,GlobalValidator.cantBeZero]],
					formStn:["",[GlobalValidator.required]],
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
						nama:form.value.formNama,
						supplier:form.value.formSupplier,
						qty:form.value.formQty,
						stn:form.value.formStn,
						kategori:form.value.formKategori,
						ctn:form.value.formCtn,
					};
					console.log('reqVar :',this.rw(()=>this.globalService.postData(this.currentPage,[reqVar])))
					
				}else return
			},
			modalRef:undefined,
			getStnFilterData:()=>[...new Set(this.stock.stock.daftar.filterData['Qty/ Ctn'].map((item:any)=>item.split(' ')[1]))],
			getDatalist:(pointer:string)=>this.stock.stock.daftar.filterData[pointer],
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
					formStn:[initialData.stn,[GlobalValidator.required]],
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
						nama:form.value.formNama,
						supplier:form.value.formSupplier,
						qty:form.value.formQty,
						stn:form.value.formStn,
						kategori:form.value.formKategori,
					};
					console.log('reqVar =',reqVar);
					//console.log('reqVar :',this.rw(()=>this.globalService.postData(this.currentPage,[reqVar])))
					
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
	delete=(data:any,embedName?:string|undefined)=>{
		//this.gridOptions.api.showLoadingOverlay();
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
			
			return this.rw(()=> this.globalService.deleteData(dbName,idArr,embedName,data[0]._idDaftar));
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
