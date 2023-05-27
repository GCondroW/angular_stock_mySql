import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVar } from '../../globalVar';

@Injectable({
  providedIn: 'root',
})

export class GlobalService {
	private http : HttpClient = inject(HttpClient);
	private url = "http://127.0.0.1:3000/excelDb";
	
	constructor() { 

	}
	getData=()=>{
		return this.http.get(this.url)
	};
	
	getSheetNames=(excelData:{[key:string]:any})=>{
		let temp:{[key:string]:any}={}
		Object.keys(excelData).map(pointer=>{
			console.log(pointer);
			temp[pointer]=Object.keys(excelData[pointer]);
		})
		return temp;
	};
}