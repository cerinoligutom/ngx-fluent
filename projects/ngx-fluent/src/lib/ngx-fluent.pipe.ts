import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngxFluent',
})
export class NgxFluentPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
