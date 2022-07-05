import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FluentBundle, FluentResource } from '@fluent/bundle';

@Injectable({
  providedIn: 'root',
})
export class NgxFluentService {
  locale = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  translate(key: string): string | null {
    return null;
  }

  setLocale(locale: string): void {
    this.locale.next(locale);
  }
}
