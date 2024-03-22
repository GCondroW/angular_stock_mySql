import { Component,OnInit,inject } from '@angular/core';
import { DynamicDropdownComponent } from '../misc/dynamic-dropdown/dynamic-dropdown.component';
import { NmService } from '../service/nm.service';

@Component({
  selector: 'app-nm',
  templateUrl: './nm.component.html',
  styleUrls: ['./nm.component.css']
})
export class NmComponent {
	public JSON=JSON;
	public output:any={};
	private nmService:NmService=inject(NmService);;
	constructor(){
		
	};
	ngOnInit(){
		
		

	}
	
	
	
	public ddObj={
		pajak:{
			initVar:["PAJAK","GLOBAL"],
			currentValue:"",
			getPajakSupplier:(a:string)=>{
				if(a===this.ddObj.pajak.currentValue)return console.log("doing literal nothing")
				if(a!=this.ddObj.pajak.currentValue){
					this.ddObj.supplier.clean();
					this.ddObj.daftar.clean();
				}
				this.ddObj.pajak.currentValue=a;
				this.nmService.request.get("db",{t:"supplier",col:["nama","id_supplier"],con:["kategori="+"'"+a+"'"]}).subscribe((x:any)=>{
					this.ddObj.supplier.initVar=x.map((x:any)=>{
						return {value:x.nama,id:x.id_supplier};
					});
				})
			},
		},
		supplier:{
			initVar:null,
			currentValue:"",
			idCallback:(id:number)=>{
				console.log("supplier id callback = ",id);
				this.nmService.request.get("db",{
						t:"daftar",
						col:["nama","id_daftar"],
						con:["id_supplier="+id],
				}).subscribe((x:any)=>{
					
					this.ddObj.daftar.initVar=x.map((x:any)=>{
						console.log({value:x.nama,id:x.id_daftar})
						return {value:x.nama,id:x.id_daftar};
					});
				})
			},
			clean:()=>{
				console.log("clean supplier");
				this.ddObj.supplier.initVar=null;
			},
		},
		daftar:{
			initVar:null,
			currentValue:"",
			idCallback:(id:number)=>{},
			clean:()=>{
				console.log("daftar supplier");
				this.ddObj.daftar.initVar=null;
			},
		},
	};
}
