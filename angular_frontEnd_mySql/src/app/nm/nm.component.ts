import { Component } from '@angular/core';
import { NmService } from '../service/nm.service';

@Component({
  selector: 'app-nm',
  templateUrl: './nm.component.html',
  styleUrls: ['./nm.component.css']
})
export class NmComponent {
	public output:any={};
	private nmService:any={};
	constructor(){
		nmService:NmService=inject(NmService);
	};
	ngOnInit(){
		this.output["a"]=NmService.request.get("nm");
		console.log(this.output);
	}
}
