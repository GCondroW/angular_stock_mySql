import { Injectable,inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { read, utils, writeFile } from "xlsx";

@Injectable({
  providedIn: 'root'
})
export class XtService {
	private http : HttpClient = inject(HttpClient);
	private headers=new HttpHeaders();
	constructor() { 

	}
	
	setHeader=(key:string,value:string)=>{
		console.log("setHeader",this.headers=this.headers.set(key,value));
		
	};
	getHeader=()=>this.headers;			


	excelHandler={
		toJson:async(e:any)=>{
			let fileName=e.target.files[0].name;
			if(fileName.split(".")[1]!=="xlsx")return alert("ERR : "+'fileName.split(".")[1]!=="xlsx"')
			let file=e.target.files[0]
			let data=await file.arrayBuffer();
			let workBook=read(data);
			let sheetName=workBook.SheetNames[0];		
			let temp: {[index: string]:any} = {};
			workBook.SheetNames.map((sheetName:any)=>{
				temp[sheetName]=utils.sheet_to_json(workBook.Sheets[sheetName],{blankrows:true,defval:""});
			});
			console.log("excelHandler.toJson",temp);
			return temp;
		},
		toExcel:(data:any,fileName:string)=>{
			let dataSheet=utils.json_to_sheet(data);
			let wb = utils.book_new();
			utils.book_append_sheet(wb,dataSheet , fileName);
			writeFile(wb, fileName+".xlsx", { compression: true });
		},
	};
	req={
		get:(url:string)=>this.http.get(url.toString(),{headers:this.headers}),
		post:(url:string,data:any)=>this.http.post(url.toString(),data,{headers:this.headers}),
		delete:(url:string)=>this.http.delete(url.toString(),{headers:this.headers}),
	};
	
  
}
