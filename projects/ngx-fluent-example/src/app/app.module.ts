import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxFluentModule } from 'ngx-fluent';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxFluentModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
