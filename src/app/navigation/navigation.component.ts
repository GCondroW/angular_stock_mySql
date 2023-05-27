import { Component, Input } from '@angular/core';
import { GlobalVar } from '../globalVar';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
	constructor(){
		console.log(this);
	}
	@Input() sheetNames:any;
	@Input() tableNames:any;
	toggleValue=false;
	toggleUploadField=()=>this.toggleValue=!this.toggleValue;
}
