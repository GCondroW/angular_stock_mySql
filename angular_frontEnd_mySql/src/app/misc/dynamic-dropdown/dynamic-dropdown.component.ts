import { Component,Input,OnInit,Injectable } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
   providedIn: 'root',
})
@Component({
  selector: 'app-dynamic-dropdown',
  templateUrl: './dynamic-dropdown.component.html',
  styleUrls: ['./dynamic-dropdown.component.css']
})
export class DynamicDropdownComponent {
	public JSON=JSON;
	public console=console;
	public value:any="";
	public togle:boolean=false;
	public selectedId:number=-1;
	ngOnInit(){
	
	}
	@Input() data?:any|null;
	@Input() idCallback:any|null;
	@Input() id:any|null;
	@Input() label:any|null;
	public changeFunction=(event:any)=>{
		event.target.value=event.target.value.toUpperCase();
		this.value=event.target.value||"";
		let id=-1
		this.data.find((x:any)=>{
			if(x.value===this.value){
				id=x.id;
				return true;
			}else{
				return false;
			}
		});
		
		if(id>0){
			this.selectedId=id;
			this.idCallback(id)
		}
		
	};
}
