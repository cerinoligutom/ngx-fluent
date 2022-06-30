import { NgModule } from '@angular/core';
import { NgxFluentPipe } from './ngx-fluent.pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [NgxFluentPipe],
  imports: [HttpClientModule],
  exports: [NgxFluentPipe],
})
export class NgxFluentModule {}
