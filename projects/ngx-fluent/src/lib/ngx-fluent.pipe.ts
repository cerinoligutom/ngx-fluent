import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fluent',
})
export class NgxFluentPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
