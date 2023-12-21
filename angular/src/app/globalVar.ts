import { ColDef } from 'ag-grid-community';
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
				url:"http://127.0.0.1:3420/",
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
					console.log('transaksi => ',JSON.parse(JSON.stringify((temp))))
					this.daftar.transaksi.data=JSON.parse(JSON.stringify((temp)));
					this.daftar.transaksi.maxCharLength=this.getMaxCharLength(temp);
					this.daftar.transaksi.colDef=options.columnDefs;
					this.daftar.transaksi.header={};
					if(!!temp[0])this.daftar.transaksi.header=Object.keys(temp[0]);
					if(!!temp[0])
					console.log("EXCLUDE COL",options);
					this.daftar.transaksi.filterData=this.generateFilterData(JSON.parse(JSON.stringify((temp))),
						options.excludedTableColumn
					);
					console.log(temp);
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
			console.log("==>SET ",data,dbName)
			console.log
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
			console.log("generteFilterData",data);
			console.log("excludedCol",excludedCol);
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
					alertString+="["+(i+1)+"]"+"\n:";
					Object.keys(item).map((pointer:any)=>{
						alertString+=pointer+"\t:"+item[pointer]+"\n";
					});
					i++;
					alertString+="====================\n";
				});
				return alertString;
			}else{
				Object.keys(body).map((pointer:any)=>{
					alertString+=pointer+"\t:\t"+body[pointer]+"\n";
				});
				return "<a>"+alertString+"</a>";
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
		constructor(
			name?:string|null,
			id?:string|null,
			dbKey?:number,
			tableData?:any,
		){
			//let temp:{tableName:any};
			if(!name)name='Guest';
			this.setName(name);
			if(!id)id='-1';
			this.setId(id);
			this.setDbKey(dbKey||-1)
			if(tableData){
				tableData=JSON.parse(tableData);
				Object.keys(tableData).map((tableName:string)=>{
					
					this.setTableData(this.getDbKey(),tableData[tableName][this.getDbKey()],tableName)
				});
			}else{
				console.log('this',this);
				console.log('name',name);
				console.log('id',id);
				console.log('dbKey',dbKey);
				console.log('tableData',tableData);
				tableData={};
				Object.keys(tableData).map((tableName:string)=>{
					this.setTableData(this.getDbKey(),tableData[tableName][this.getDbKey()],tableName)
					console.log("+++++++++++++++++++++++++++++++++",this);
				});
			};
		};
		public setId=(id:string)=>{
			this.id=id;
			localStorage.setItem('id',id);
		};
		public setName=(name:string)=>{
			this.name=name;
			localStorage.setItem('name',name);
			return this.name;
		};
		public setDbKey=(dbKey:number)=>{
			this.dbKey=dbKey;
			localStorage.setItem('dbKey',dbKey.toString());
			return dbKey;
		};
		public setTableData=(dbKey:number,data:Array<any>,tableName:string)=>{
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
		pushTableData=(dbKey:number,data:Array<any>,tableName:string)=>{
			let temp=JSON.parse(localStorage.getItem('tableData')||'{}');
			if(!temp[tableName]){
				temp[tableName]=[];
			};
			temp[tableName][dbKey].push(data);
			return data;
		};
		public getId=()=>localStorage.getItem('id');
		public getName=()=>localStorage.getItem('name');
		public getDbKey=()=>Number(localStorage.getItem('dbKey'));
		public getTableData=(tableName:any)=>{
			console.log("===================================================");
			console.log("tableName",tableName)
			let temp=JSON.parse(localStorage.getItem('tableData')||'{}');
			console.log("temp",temp)
			console.log("this.getDbKey()",this.getDbKey())
			if(temp[tableName])return temp[tableName][this.getDbKey()];
			return [];
			//return Object.assign(temp,{[tableName]:[]})
			
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
			console.log("localStorage",JSON.parse(localStorage.getItem('options')||'{}'));
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
					filter:1,
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
					filter:0,
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
					valueFormatter: (params:any)=>{
						console.log("globalVar Params");
						return params.value? new Date(params.value).toLocaleString('id',{
							year: "numeric",
							month: "numeric",
							day: "numeric",
						}):"";
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