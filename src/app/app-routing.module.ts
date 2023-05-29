import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImportComponent } from './import/import.component';
import { DaftarComponent } from './daftar/daftar.component';

const dynamicRoutes: Routes = [
	{path :"" , component : HomeComponent},
	{path :"import" , component : ImportComponent},
	{path :"daftar" , component : DaftarComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(dynamicRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
	
	addRoute=(route:any[])=>{
		route.map((item)=>{
			dynamicRoutes.push({
				path :item , 
				component : HomeComponent,
			},)
		});
	}
	
}