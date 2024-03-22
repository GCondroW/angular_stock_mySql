import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { APP_BASE_HREF } from "@angular/common";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UploadComponent } from './misc/upload/upload.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalService } from './service/global/global.service';
//import { ImportComponent } from './import/import.component';
//import { DaftarComponent } from './daftar/daftar.component';
import { DataTableComponent } from './misc/data-table/data-table.component';
import { DynamicTableComponent } from './misc/dynamic-table/dynamic-table.component';

import { AgGridModule } from 'ag-grid-angular';
import { DynamicModalComponent } from './misc/dynamic-modal/dynamic-modal.component';

//import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ReactiveFormsModule } from '@angular/forms';
import { StockComponent } from './stock/stock.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { GlobalVar } from './globalVar'

import { GlobalErrorHandlerService  } from './global-error-handler.service';
import { NmComponent } from './nm/nm.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DynamicDropdownComponent } from './misc/dynamic-dropdown/dynamic-dropdown.component';
import { DaftarComponent } from './nm/daftar/daftar.component';
import { DaftarBarangComponent } from './mu/daftar-barang/daftar-barang.component'

import { GridJsAngularModule } from 'gridjs-angular';

const corsOptions={
	withCredentials: true,
};
const options=JSON.parse(localStorage.getItem('options')||"{}");
const corsConfig=JSON.parse(JSON.stringify(options.corsConfig||GlobalVar.config.defaultValue.cors));
const config: SocketIoConfig = { url: corsConfig.url, options:corsConfig.options };

@NgModule({
  declarations: [
    AppComponent,
    //HomeComponent,
    NavigationComponent,
    UploadComponent,
    //ImportComponent,
    //DaftarComponent,
    DataTableComponent,
    DynamicModalComponent,
    DynamicTableComponent,
    StockComponent,
    NmComponent,
    NotFoundComponent,
    DynamicDropdownComponent,
    DaftarComponent,
    DaftarBarangComponent,
  ],
  imports: [
  	BrowserModule,
	SocketIoModule.forRoot(config),
    AppRoutingModule,
	HttpClientModule,
	AgGridModule,
	ReactiveFormsModule,
	NgbModule,
	FormsModule,
	GridJsAngularModule,
  ],
  providers: [
		GlobalService,
		{
			provide:ErrorHandler,
			useClass:GlobalErrorHandlerService ,
		},
		{
			provide: APP_BASE_HREF,
			//useValue: "/" + (window.location.pathname.split("/")[1] || ""),
			useValue: "/",
		},
	],
  bootstrap: [AppComponent]
})
export class AppModule {}