import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxFluentService } from './ngx-fluent.service';

@Pipe({
  name: 'fluent',
  pure: false,
})
export class NgxFluentPipe implements PipeTransform {
  value: string | null = null;

  localeChanges: Observable<string | null> | null = null;

  constructor(private readonly fluentService: NgxFluentService) {}

  transform(key: string, args?: any): string {
    if (!this.localeChanges) {
      this.localeChanges = this.fluentService.localeChanges;

      this.localeChanges.subscribe(async () => {
        this.value = await this.fluentService.translate(key, args);
      });
    }

    return this.value ?? key;
  }
}
