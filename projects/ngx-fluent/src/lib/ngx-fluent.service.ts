import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, catchError, of, lastValueFrom } from 'rxjs';
import { FluentBundle, FluentResource } from '@fluent/bundle';

import { TranslationSource } from './translation-source.interface';

@Injectable({
  providedIn: 'root',
})
export class NgxFluentService {
  private locale = new BehaviorSubject<string | null>(null);

  private translationSourceMap: Record<string, string | TranslationSource> = {};
  private translationsMap = new Map<string, FluentBundle | null>();

  localeChanges = this.locale.asObservable();

  constructor(private http: HttpClient) {}

  private fetchTranslation(locale: string) {
    // If we already have the translation, return it.
    const translationBundle = this.translationsMap.get(locale);
    if (translationBundle) {
      return of(translationBundle);
    }

    // If we don't have the translation, fetch it.
    const source = this.translationSourceMap[locale] ?? '';
    const path = typeof source === 'string' ? source : source.path;

    return this.http.get(path, { responseType: 'text' }).pipe(
      map((content) => {
        let config;
        if (typeof source !== 'string') config = source.bundleConfig;
        const bundle = new FluentBundle(locale, config);
        const resource = new FluentResource(content);
        const errors = bundle.addResource(resource);

        if (errors.length) {
          console.error(errors);
        }

        this.translationsMap.set(locale, bundle);
        return bundle;
      }),
      catchError((error) => {
        console.error(error);
        throw error;
      }),
    );
  }

  get currentLocale() {
    return this.locale.value;
  }

  setLocale(locale: string): void {
    this.fetchTranslation(locale)
      .pipe(catchError(() => locale))
      .subscribe(() => {
        this.locale.next(locale);
      });
  }

  setTranslationSourceMap(translationSourceMap: Record<string, string | TranslationSource>) {
    this.translationSourceMap = translationSourceMap;
  }

  async translate(key: string, args?: any): Promise<string | null> {
    const locale = this.currentLocale;
    if (!locale) {
      return null;
    }

    const bundle = await lastValueFrom(this.fetchTranslation(locale)).catch(() => null);
    if (!bundle) {
      return null;
    }

    const message = bundle.getMessage(key);
    if (!message?.value) {
      return null;
    }

    return bundle.formatPattern(message.value, args);
  }
}
