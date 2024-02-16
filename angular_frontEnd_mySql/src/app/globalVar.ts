import { ColDef } from 'ag-grid-community';
import { isDevMode } from '@angular/core';
import { environment } from '../environments/environment';
//let serverConfig 
//console.log(async()=>serverConfig = await import (environment.serverConfigDir)());
const domainName="cwtest.biz.id";
const prodDomainName="https://cwtest.biz.id"+":"+environment.PORT;
const devDomainName="https://localhost"+":"+environment.PORT;
const url = new URL("https://"+window.location.hostname+":"+environment.PORT);
export const GlobalVar ={
	_var:{
		socketConfig:"",
	},
	dbKey:-1,
	userId:-1,
	excelDb:{
		data:{},
		sheetNames:{},
		tableNames:{},
	},
	pages:{},
	config:{
		cors:"",
		adm:["guest42","a89",",./`"],
		defaultValue:{
			cors:{
				url:url,
				options:{withCredentials: true},
			},
		},
	},
	stockData:class stockData{
		raw:Array<any>=[];
		maxCharLength:any={};
		
		daftar:any={
			stock:{
				data:[],
				colDef:[],
				header:[],
				filterData:[],
				maxCharLength:{},
				defaultFilterParams:{},
				createView:(data:any,options:any)=>{
					let temp:Array<any>=[];
					console.log(data);
					data.map((itemData:any)=>{
						temp.push(itemData)
					})
					this.daftar.stock.data=JSON.parse(JSON.stringify((temp)));
					this.daftar.stock.maxCharLength=this.getMaxCharLength(temp);
					this.daftar.stock.colDef=options.columnDefs;
					this.daftar.stock.header={};
					if(!!temp[0])this.daftar.stock.header=Object.keys(temp[0]);
					if(!!temp[0])
					console.log(temp);
					this.daftar.stock.filterData=this.generateFilterData(JSON.parse(JSON.stringify((temp))),
						options.excludedTableColumn
					);
					
				},
			},
			transaksi:{
				data:[],
				colDef:[],
				header:[],
				filterData:[],
				maxCharLength:{},
				defaultFilterParams:{},
				createView:(data:any,options:any)=>{
					data.map((item:any)=>{
						item.TANGGAL=this.convertDate(item.TANGGAL);
					});
					let temp:Array<any>=data;
					//console.log('transaksi => ',JSON.parse(JSON.stringify((temp))))
					this.daftar.transaksi.data=JSON.parse(JSON.stringify((temp)));
					this.daftar.transaksi.maxCharLength=this.getMaxCharLength(temp);
					this.daftar.transaksi.colDef=options.columnDefs;
					this.daftar.transaksi.header={};
					if(!!temp[0])this.daftar.transaksi.header=Object.keys(temp[0]);
					if(!!temp[0])
					//console.log("EXCLUDE COL",options);
					this.daftar.transaksi.filterData=this.generateFilterData(JSON.parse(JSON.stringify((temp))),
						options.excludedTableColumn
					);
					//console.log(temp);
				},
			},
		};
		constructor(data?:Array<any>|null|undefined){
			/*if(!data){
				let localData=this.getLocalData();
				if(!localData){
					this.set([]);
				}else{
					this.set(localData);
				}
			}else{
				this.set(data);
			};*/
		};
		public findById=(id:string)=>{
			return this.raw.find((item)=>item._id===id)
		};
		public length=this.raw.length;
		public set=(data:Array<any>,dbName:string,options:any)=>{
			this.raw=data;
			//console.log("==>SET ",data,dbName)
			this.daftar[dbName].createView(JSON.parse(JSON.stringify((data))),options[dbName]);
			/*Object.keys(this.stock).map(pointer=>{
				this.stock[pointer].createView(JSON.parse(JSON.stringify((data))));
			})*/
		};
		public setFilterParams=(filterObj:any,dbName:string)=>{
			this.daftar[dbName].defaultFilterParams=filterObj;
			console.log("this.daftar[dbName].defaultFilterParams",this.daftar[dbName].defaultFilterParams);
		};
		private getLocalData=()=>{
			let temp=localStorage.getItem('raw');
			if(!!temp)return JSON.parse(temp)
			return null	
		};
		private getMaxCharLength=(data:Array<any>)=>{
			try{
				let header=Object.keys(data[0]);
				let returnVar:any={};
				header.map(item=>{
					returnVar[item]=0;
				});
				data.map(item=>{
					header.map(headerItem=>{
						let temp=item[headerItem].toString().length;
						if(temp>returnVar[headerItem])returnVar[headerItem]=temp;
					});
				});
				return returnVar;
			}catch(e){
				return 0;
			}
		};
		public get=()=>this.raw;
		public generateFilterData=(data:Array<any>,excludedCol:Array<any>)=>{
			//console.log("generteFilterData",data);
			//console.log("excludedCol",excludedCol);
			let temp:any={};
			data.map(item=>{
				excludedCol.map(excludedColItem=>{
					delete item[excludedColItem];
				});
			});
			let dataColumn=Object.keys(data[0] || {});
			dataColumn.map(pointer=>{
				temp[pointer]=[];
			});
			data.map(item=>{
				dataColumn.map(pointer=>{
					if(!!item[pointer])temp[pointer].push(item[pointer]);
					//if(pointer==="SUPPLIER")console.log(item[pointer]);
				});
			});
			dataColumn.map(pointer=>{
				temp[pointer]=[...new Set(temp[pointer])]
				if(pointer!=="ctn") return temp[pointer].sort();
				temp[pointer].sort((a:any, b:any) => (a - b));
			});
			Object.keys(temp).map(
				item=>temp[item]=temp[item].filter(
					(item2:any)=>item2!=''
				)
			);
			return temp;
		};
		private convertDate=(dateString:string)=>{
			let temp=new Date(dateString).toLocaleString('id');
			return temp;
		};
		private customLowerCaseComparator = (valueA:any, valueB:any) => {
			
			console.log("valueA",valueA,"valueB",valueB);
			if (typeof valueA === 'string') {
				return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
			}

			return (valueA > valueB? 1 : (valueA < valueB ? -1 : 0));
		};
		public deleteById=(id:Array<number>)=>{
			console.log("ID", id);
			let deletedDataId=id;
			let oldData=this.raw;
			let newAndUpdatedData=oldData.filter((item:any)=>!deletedDataId.includes(item.ID_DAFTAR));
			console.log("newAndUpdatedData : ",newAndUpdatedData);
			return newAndUpdatedData;
		};
	},
	import:{
		message:{
			dataIsEmpty:"DATA_IS_EMPTY_MESSAGE",
			inputInvalid:"INPUT_INVALID_MESSAGE",
		},
		tableColumn:["Seri","Nama Barang","Qty/ C","Ctn","Kode"],
	},
	dbServerUrl:"http://127.0.0.1:3420/",
	pagesObj:["import","daftar"],
	consoleDump:async(x:Array<any>)=>{
		console.log("\\/============================================ C O N S O L E  D U M P ============================================\\/");
		await x.map(item=>{
			console.log(item[0]+" : ",item[1]);
		})
		console.log("/\\============================================ C O N S O L E  D U M P ============================================/\\");
	},
	alert:(body:any,header?:string|undefined)=>{
		let alertString:string="";
		if(!header)header="";
		if(!!header)header=header+"\n";
		alertString+=header;
		try{
			if(Array.isArray(body)){
				let i=0;
				body.map(item=>{
					alertString+="["+(i+1)+"]"+"\n";
					Object.keys(item).map((pointer:any)=>{
						alertString+=pointer+" : "+item[pointer]+"\n";
					});
					i++;
					alertString+="====================\n";
				});
				return alertString;
			}else{
				Object.keys(body).map((pointer:any)=>{
					let temp=body[pointer]?body[pointer]:"-";
					alertString+=pointer+" : "+temp+"\n";
				});
				return alertString;
			}
		}catch(e){
			alert("ERR")
			return
		};
	},
	
	user:class user{
		name:string='';
		id:string='';
		dbKey:number=-1;
		tableData:any={};
		priviledge:number=0;
		isLogin:boolean=false;
		constructor(
			name?:string|null,
			id?:string|null,
			dbKey?:number,
			tableData?:any,
			priviledge?:number,
			isLogin?:string|null,
		){
			let defaultValue=this.defaultValue;
			if(!name)name=defaultValue.name;
			this.setName(name);
			if(!id)id=defaultValue.id;
			this.setId(id);
			this.setDbKey(dbKey||defaultValue.dbKey)
			if(tableData){
				tableData=JSON.parse(tableData);
				Object.keys(tableData).map((tableName:string)=>{
					
					this.setTableData(this.getDbKey(),tableData[tableName][this.getDbKey()],tableName)
				});
			}else{
				tableData=defaultValue.tableData;
				Object.keys(tableData).map((tableName:string)=>{
					this.setTableData(this.getDbKey(),tableData[tableName][this.getDbKey()],tableName)
				});
			};
			this.setPriviledge(priviledge||defaultValue.priviledge);
			if(!isLogin)isLogin="false";
			if(isLogin==="true"){
				this.setLogin(true);
			}else this.setLogin(defaultValue.isLogin);
			console.log("THIS USER = >",this);
		};
		public defaultValue={
			name:"Guest",
			id:"-1",
			dbKey:-1,
			tableData:{},
			priviledge:-1,
			isLogin:false,
		};
		public setId=(id:string)=>{
			this.id=id;
			localStorage.setItem('id',id);
			return this.id;
		};
		public getId=()=>localStorage.getItem('id');
		public setName=(name:string)=>{
			this.name=name;
			localStorage.setItem('name',name);
			return this.name;
		};
		public getName=()=>localStorage.getItem('name');
		public setPriviledge=(x:number)=>{
			this.priviledge=x;
			localStorage.setItem('priviledge',x.toString());
			return this.priviledge;
		};
		public getPriviledge=()=>localStorage.getItem('priviledge');
		public setDbKey=(dbKey:number)=>{
			this.dbKey=dbKey;
			localStorage.setItem('dbKey',dbKey.toString());
			return this.dbKey;
		};
		public setLogin=(status:boolean)=>{
			this.isLogin=status;
			localStorage.setItem('isLogin',status.toString());
			return this.isLogin;
		};
		public logout=()=>{
			let logoutPrompt=window.confirm('logout, '+this.name+"?");
			if(!!logoutPrompt){
				let defaultValue=this.defaultValue;
				this.setName(defaultValue.name);
				this.setId(defaultValue.id);
				this.setPriviledge(defaultValue.priviledge);
				this.setLogin(defaultValue.isLogin);
				alert("logout success");
				return true;
			};
			return false;
		};
		public getDbKey=()=>Number(localStorage.getItem('dbKey'));
		public setTableData=(dbKey:number,data:Array<any>,tableName:string)=>{
			//console.log("dbKey",dbKey);
			//console.log("data",data);
			//console.log("tableName",tableName);
			let temp=JSON.parse(localStorage.getItem('tableData')||'{}');
			if(!temp[tableName]){
				temp[tableName]={};
			};
			let tempObj:any=temp;
			let tempArr:any=[];
			tempArr[dbKey]=data;
			tempObj[tableName]=tempArr;
			localStorage.setItem('tableData',JSON.stringify(tempObj));
			this.tableData=tempObj;
			return data;
		};
		public pushTableData=(dbKey:number,data:Array<any>,tableName:string)=>{
			let temp=JSON.parse(localStorage.getItem('tableData')||'{}');
			if(!temp[tableName]){
				temp[tableName]=[];
			};
			temp[tableName][dbKey].push(data);
			return data;
		};
		public getTableData=(tableName:any)=>{
			let temp=JSON.parse(localStorage.getItem('tableData')||'{}');
			if(temp[tableName])return temp[tableName][this.getDbKey()];
			let allTableVar:any={};
			Object.keys(temp).map(tableName=>{
				allTableVar[tableName]=temp[tableName][this.getDbKey()];
			});;
			return allTableVar;
		};
		public prompt=()=>{
			let newName=window.prompt('ganti',this.name);
			if(!!newName){
				alert("WELCOME => "+this.setName(newName));
				return true;
			};
			return false;
		};
		public deleteById=(id:Array<number>,tableName:string)=>{
			console.log("ID", id);
			let deletedDataId=id;
			let newAndUpdatedData=this.getTableData(tableName);
			console.log("newAndUpdatedData",newAndUpdatedData)
			return newAndUpdatedData.filter((item:any)=>!deletedDataId.includes(item.ID_DAFTAR))
		};
		public arrMove = (arr:any,from:any,to:any)=>{
			arr.splice(to,0,arr.splice(from,1)[0]);
			return arr;
		};
	},
	options:class options{
		data:any={};
		constructor(optionsData:any){
			//optionsData=JSON.parse(optionsData||'{}');
			
			Object.keys(optionsData).map((pointer:any)=>{
				this.setOptions(optionsData[pointer],pointer);
			});
		};
		setOptions=(data:any,index:string)=>{
			this.data[index]=data
			localStorage.setItem('options',JSON.stringify(this.data));
			//console.log("localStorage",JSON.parse(localStorage.getItem('options')||'{}'));
			return this.data[index];
		};
		unsetOptions=(key:string)=>{
			try{
				let temp=localStorage.getItem('options');
				let temp2=JSON.parse(temp||"{}");
				delete temp2[key];
				this.data=temp2;
				localStorage.setItem('options',JSON.stringify(temp2));
			}catch(e){console.log(e)};
		};
		clearOptions=()=>{
			localStorage.setItem('options',JSON.stringify('{}'));
			this.data={};
		};
		
	},
	
	counter:class counter{
		private startNumber:number;
		private count:number;
		private iterateValue:number;	
		constructor(startNumber:number,iterateValue:number){
			this.startNumber=startNumber;
			this.count=startNumber;
			this.iterateValue=iterateValue;
		};
		public up=()=>{
			this.count=this.count+this.iterateValue;
			return this.count;
		};
		public down=()=>{
			this.count=this.count-this.iterateValue;
			return this.count;
		};
	},
	
	socketConfig:class socketConfig{
		private defaultValue:{
			url:string,
			options:{
				withCredentials:boolean
			},
		}={
			url:"http://127.0.0.1:3420/",
			options:{
				withCredentials:true,
			},
		};
		public url:string=JSON.parse(JSON.stringify(this.defaultValue.url));
		public options:{
			withCredentials:boolean
		}=JSON.parse(JSON.stringify(this.defaultValue.options));
		constructor(){
			console.log("socketConfig","initiated",this);
		};
		public setUrl=(url:string)=>{
			return this.url=url;
		};
	},
	defaultColumnDefs:{
		stock:{
			excludedTableColumn:["ID_DAFTAR","NAMA","QTY","STOCK"],
			defaultFilterParams:{
				SUPPLIER:{
					filterType: 'text',
					type:'contains',
					filter:"",
				},
				KATEGORI:{
					filterType: 'text',
					type:'contains',
					filter:"",
				},
				STOCK:{
					filterType: 'number',
					type:'greaterThanOrEqual',
					filter:"",
				},
				STN:{
					filterType: 'text',
					type:'contains',
					filter:"",
				},
			},
			columnDefs:[
				{
					field: "ID_DAFTAR",
					hide: true,		
				},
				{
					field: "NAMA",
					sort: "asc",
					pinned:'left',
				},
				{
					field: "QTY",
				},
				{
					field: "STN",
				},
				{
					field: "SUPPLIER",
					hide: true,
				},
				{
					field: "KATEGORI",
					hide: true,
				},
				{
					field: "STOCK",
					filter:"agNumberColumnFilter",
					pinned:'left',
					type:"numericColumn",
				},
				
			],
		},
		transaksi:{
			excludedTableColumn:["ID_TRANSAKSI","ID_DAFTAR","NAMA","JUMLAH"],
			defaultFilterParams:{
				NAMA:{
					filterType: 'text',
					type:'contains',
					filter:"",
				},
				SUPPLIER:{
					filterType: 'text',
					type:'contains',
					filter:"",
				},
				KATEGORI:{
					filterType: 'text',
					type:'contains',
					filter:"",
				},
				JUMLAH:{
					filterType: 'number',
					type:'greaterThanOrEqual',
					filter:'',
				},
				USER:{
					filterType: 'text',
					type:'contains',
					filter:"",
				},
				TANGGAL:{
					filterType: 'text',
					type:'contains',
					filter:"",
				},
				JENIS:{
					filterType: 'text',
					type:'notContains',
					filter:"",
				},	
				KETERANGAN:{
					filterType: 'text',
					type:'contains',
					filter:"",
				},					
			},
			columnDefs:[
				{
					field: "ID_TRANSAKSI",
					hide: true,
					autoHeight: true,
				},
				{
					field: "ID_DAFTAR",
					hide: true,
					autoHeight: true,
				},
				{
					field: "NAMA",
					autoHeight: true,
					sort:false,
					pinned:'left',
				},
				{
					field: "JUMLAH",
					filter: "agNumberColumnFilter",
					type: "numericColumn",
					pinned:'left',
					autoHeight: true,
				},
				{
					field: "USER",
					autoHeight: true,
				},
				{
					field: "TANGGAL",
					sort: "desc",
					autoHeight: true,
					/*
					valueFormatter: (params:any)=>{
						try{
							var dateAsString = params.data.TANGGAL;
							
							var localeDatePart = dateAsString.split(',');
							let part={
								datePart:localeDatePart[0],
								timePart:localeDatePart[1],
							};
							let datePart=part.datePart.split("/");
							let timePart=part.timePart.split(".");
							let newDate=new Date(datePart[2],datePart[1]-1,datePart[0],timePart[0],timePart[1],timePart[2]);
							console.log(" 	-dateAsString",dateAsString)
							console.log("	-newDate",newDate)
							return newDate.toLocaleString("id");
							//return `${dateParts[0]} - ${dateParts[1]} - ${dateParts[2]}`;
						}catch(e){
							return "";
						}
					},
					*/
					comparator: (date1:any,date2:any)=>{
						try{
							let toNumber=(x:any)=>{
								var dateAsString = x;
								var localeDatePart = dateAsString.split(',');
								let part={
									datePart:localeDatePart[0],
									timePart:localeDatePart[1],
								};
								let datePart=part.datePart.split("/");
								let timePart=part.timePart.split(".");
								let newDate=new Date(datePart[2],datePart[1]-1,datePart[0],timePart[0],timePart[1],timePart[2])
								return Date.parse(newDate.toString());
							};
							date1=toNumber(date1);
							date2=toNumber(date2);
							if (date1 === null && date2 === null) {
								return 0;
							}
							if (date1 === null) {
								return -1;
							}
							if (date2 === null) {
								return 1;
							}
							return date1 - date2;
						}catch(e){
							return 0;
						}
					},
				},
				{
					field: "JENIS",
					hide: true,
					autoHeight: true,
				},
				{
					field: "KETERANGAN",
					hide: true,
					autoHeight: true,
				},
				{
					field: "KATEGORI",
					hide: true,
					autoHeight: true,
				},
				{
					field: "SUPPLIER",
					hide: true,
					autoHeight: true,
				},
			],
		},
	},
}