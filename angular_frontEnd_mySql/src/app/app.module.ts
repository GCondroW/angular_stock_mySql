import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxIndexedDBModule,DBConfig   } from 'ngx-indexed-db';
const dbConfig: DBConfig  = {
	name: 'MyDb',
	version: 1,
	objectStoresMeta: [{
		store: 'tableCache',
		storeConfig: { keyPath: 'id', autoIncrement: true },
		storeSchema: [
			{ name: 'sheetName', keypath: 'sheetName', options: { unique: false } },
			{ name: 'value', keypath: 'value', options: { unique: false } },
		]
	
	},{
		store: 'xtKey',
		storeConfig: { keyPath: 'id', autoIncrement: true },
		storeSchema: [
			{ name: 'value', keypath: 'value', options: { unique: false } },
		]
	
	}]
};
import { AgGridModule } from 'ag-grid-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const options=JSON.parse(localStorage.getItem('options')||"{}");
const corsConfig=JSON.parse(JSON.stringify(options.corsConfig||GlobalVar.config.defaultValue.cors));
const config: SocketIoConfig = { url: corsConfig.url, options:corsConfig.options };

import { APP_BASE_HREF } from "@angular/common";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { HomeComponent } from './home/home.component';

import { StockComponent } from './stock/stock.component';
import { XtComponent } from './xt/xt.component';

import { NavigationComponent } from './navigation/navigation.component';
import { UploadComponent } from './misc/upload/upload.component';
import { DataTableComponent } from './misc/data-table/data-table.component';
import { DynamicTableComponent } from './misc/dynamic-table/dynamic-table.component';
import { DynamicModalComponent } from './misc/dynamic-modal/dynamic-modal.component';
import { NmComponent } from './nm/nm.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DynamicDropdownComponent } from './misc/dynamic-dropdown/dynamic-dropdown.component';
import { DaftarComponent } from './nm/daftar/daftar.component';
import { DaftarBarangComponent } from './mu/daftar-barang/daftar-barang.component'

import { GlobalService } from './service/global/global.service';
import { GlobalErrorHandlerService  } from './global-error-handler.service';
import { GlobalVar } from './globalVar'

const corsOptions={
	withCredentials: true,
};

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
    XtComponent,
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
	NgxIndexedDBModule.forRoot(dbConfig)
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