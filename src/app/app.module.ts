import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UploadComponent } from './misc/upload/upload.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalService } from './service/global/global.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    UploadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	HttpClientModule
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})

export class AppModule { }