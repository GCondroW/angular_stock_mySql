import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UploadComponent } from './misc/upload/upload.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalService } from './service/global/global.service';
import { ImportComponent } from './import/import.component';
import { DaftarComponent } from './daftar/daftar.component';
import { DataTableComponent } from './misc/data-table/data-table.component';
import { DynamicTableComponent } from './misc/dynamic-table/dynamic-table.component';

import { AgGridModule } from 'ag-grid-angular';
import { DynamicModalComponent } from './misc/dynamic-modal/dynamic-modal.component';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { StockComponent } from './stock/stock.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { GlobalVar } from './globalVar'

const config: SocketIoConfig = { url: GlobalVar.dbServerUrl, options: {} };


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    UploadComponent,
    ImportComponent,
    DaftarComponent,
    DataTableComponent,
    DynamicModalComponent,
    DynamicTableComponent,
    StockComponent,
  ],
  imports: [
    BrowserModule,
	SocketIoModule.forRoot(config),
    AppRoutingModule,
	HttpClientModule,
	AgGridModule,
	ReactiveFormsModule,
	NgbAlertModule
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})

export class AppModule { }