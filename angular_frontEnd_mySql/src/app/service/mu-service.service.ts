import { Injectable,inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MuServiceService {
	private http : HttpClient = inject(HttpClient);
	constructor() { }
	public req={
		get:(
			route:string,
		)=>{
			let url=new URL (route);
			return this.http.get(url.toString());
		},
	}
}
