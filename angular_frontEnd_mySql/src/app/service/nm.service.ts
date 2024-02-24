import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NmService {
	constructor() {
		private apiUrl =  new URL("https://"+window.location.hostname+":"+environment.PORT);
	}
	public request={
		get:(dbName:string,id?:Array<number> | undefined)=>{
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
