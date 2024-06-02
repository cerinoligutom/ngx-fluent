import { NgModule } from '@angular/core';
import { NgxFluentPipe } from './ngx-fluent.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({
  declarations: [NgxFluentPipe],
  exports: [NgxFluentPipe],
  imports: [],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class NgxFluentModule {}
