import { Component,Input,OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.css']
})
export class DynamicModalComponent {
		constructor(){
		
		};
		ngOnInit(){
			console.log("selectedDataId",this.selectedDataId);
			console.log("this",this);
			console.log(this.modalRef=this.modal);
			
		};
		@Input() modalTitle:string="defaultTitleName";
		@Input() modalHeader:any;
		@Input() modalBody:any;
		@Input() modalFooter:any;
		@Input() modal:any;
		@Input() modalRef:any;
		@Input() selectedDataId:any;
}
