import { Component,OnInit,inject } from '@angular/core';
import { MuServiceService } from '../../service/mu-service.service';
import { DynamicTableComponent } from '../../misc/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-daftar-barang',
  templateUrl: './daftar-barang.component.html',
  styleUrls: ['./daftar-barang.component.css']
})
export class DaftarBarangComponent {
	private muService:MuServiceService=inject(MuServiceService);
	public tableData:Array<any>=[];
	ngOnInit(){
		let muService=this.muService;
		
		muService.req.get("httpS:localhost:2125/db/daftar/").subscribe((x:any)=>{
			this.tableData=x;
			console.log(this.tableData);
		})
		

	}

}
