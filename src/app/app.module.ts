import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

// Added Modules
import {HttpClientModule} from '@angular/common/http';
import { HistoricDataComponent } from './components/historic-data/historic-data.component';

@NgModule({
  declarations: [
    AppComponent,
    HistoricDataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
