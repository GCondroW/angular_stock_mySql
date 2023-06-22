import { Component,Input,OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.css']
})
export class DynamicModalComponent {
		constructor(){
			console.log("modal.init");
		};
		ngOnInit(){
			console.log("selectedDataId",this.selectedDataId);
			console.log("this",this);
		};
		@Input() modalTitle:string="defaultTitleName";
		@Input() modalHeader:any;
		@Input() modalBody:any;
		@Input() modalFooter:any;
		@Input() modal:any;
		@Input() selectedDataId:any;
}
