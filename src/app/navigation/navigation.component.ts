import { Component, Input, inject } from '@angular/core';
import { GlobalService } from '../service/global/global.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
	globalService : GlobalService = inject(GlobalService);
	constructor(){
		console.log(this);
	}
	@Input() pages:any;
	getCurrentUrl=this.globalService.getCurrentUrl;
	isActive=(pageName:String)=>{
		let currentPage=this.getCurrentUrl().split('/')[1];		
		if(pageName===currentPage)return true
		return false
	};
	calculateStyle=(pageName:String)=>{
		let temp:any={};
		let currentPage=this.getCurrentUrl().split('/')[1];
		temp["horizontal-list"]=true;
		if(pageName===currentPage){
			temp["active"]=true;
		};
		console.log(temp);
		return temp;
	}
}
