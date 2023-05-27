import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const dynamicRoutes: Routes = [
	{path :"" , component : HomeComponent},
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