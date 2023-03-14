import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, catchError, of, lastValueFrom } from 'rxjs';
import { FluentBundle, FluentResource } from '@fluent/bundle';

@Injectable({
  providedIn: 'root',
})
export class NgxFluentService {
  private locale = new BehaviorSubject<string | null>(null);

  private translationSourceMap: Record<string, string> = {};
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
    const translationSourceUrl = this.translationSourceMap[locale] ?? '';
    return this.http.get(translationSourceUrl, { responseType: 'text' }).pipe(
      map((content) => {
        const bundle = new FluentBundle(locale);
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

  setTranslationSourceMap(translationSourceMap: Record<string, string>) {
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

    const errors: Error[] = [];
    const formatted = bundle.formatPattern(message.value, args, errors);

    for (const error of errors) console.warn(`Error when formatting message with key [${key}]:`, error);

    return formatted;
  }
}
