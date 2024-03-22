import { Injectable,inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalVar } from '../globalVar';
//import { environment } from '.../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NmService {
	private apiUrl =  new URL(GlobalVar.config.defaultValue.cors.url);
	private http : HttpClient = inject(HttpClient);
	constructor() {
		
	}
	public request={
		get:(
			route:string,
			qObj:{
				t:string,
				col:Array<string>,
				con:Array<string>,
			},
		)=>{
			let dbName=qObj.t;
			let columnName=qObj.col;
			let condition=qObj.con;
			
			if(!dbName)dbName="";
			let url=new URL (route+"/"+dbName+"/",this.apiUrl);
			let urlParam="";
			if(!!columnName){
				urlParam+="?col=";
				columnName.forEach(item=>urlParam+=item+",");
				urlParam=urlParam.slice(0,urlParam.length-1);
			};	
			if(!!condition){
				urlParam+="&con=";
				condition.forEach(item=>urlParam+=item+",");
				urlParam=urlParam.slice(0,urlParam.length-1);
			};	
			url.search=urlParam;
			return this.http.get(url.toString());
		},
		getNota:(dbName:string,id?:Array<number> | undefined)=>{
			let url=new URL (dbName,this.apiUrl);
			let idParam="";
			if(!!id){
				idParam+="?id=";
				id.forEach(item=>idParam+=item+",");
				idParam=idParam.slice(0,idParam.length-1);
			};
			url.search=idParam;
			return this.http.get(url.toString());
		}
	}
}
