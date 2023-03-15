import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, catchError, of, lastValueFrom } from 'rxjs';
import { FluentBundle, FluentResource } from '@fluent/bundle';

import type { TranslationSourceConfig, TranslationSourceMap } from './types';

@Injectable({
  providedIn: 'root',
})
export class NgxFluentService {
  private locale = new BehaviorSubject<string | null>(null);

  /**
   * Used to store unloaded source map entries since translations are lazy-loaded.
   */
  private translationSourceMap: TranslationSourceMap = {};

  /**
   * Cache for loaded translations. If a translation is loaded, it should be removed from the source map.
   */
  private translationsMap: Record<string, FluentBundle> = {};

  localeChanges = this.locale.asObservable();

  constructor(private http: HttpClient) {}

  /** This method should only be called after a bundle has been loaded. */
  private clearTranslationSourceMapEntry(locale: string) {
    delete this.translationSourceMap[locale];
  }

  private fetchTranslation(locale: string) {
    if (!(locale in this.translationSourceMap)) {
      // Check if we have loaded the translation previously.
      const translationBundle = this.translationsMap[locale];
      if (translationBundle) {
        return of(translationBundle);
      }
    }

    // If we don't have the translation, try to fetch it.
    const source = this.translationSourceMap[locale] ?? '';

    if (source instanceof FluentBundle) {
      this.translationsMap[locale] = source;
      this.clearTranslationSourceMapEntry(locale);
      return of(source);
    }

    let path: string;
    let config: TranslationSourceConfig['bundleConfig'];
    if (source && typeof source !== 'string') {
      path = source.path;
      config = source.bundleConfig;
    } else {
      path = source;
    }

    return this.http.get(path, { responseType: 'text' }).pipe(
      map((content) => {
        const bundle = new FluentBundle(locale, config);
        const resource = new FluentResource(content);
        const errors = bundle.addResource(resource);

        if (errors.length) {
          console.error(errors);
        }

        this.translationsMap[locale] = bundle;
        this.clearTranslationSourceMapEntry(locale);
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

  /**
   * Used to set translation sources for lazy-loading. Can be called multiple times to add multiple sources.
   *
   * If an existing locale (key) has been loaded previously and is configured here again, the translations
   * for that locale will be reloaded.
   */
  setTranslationSourceMap(translationSourceMap: TranslationSourceMap) {
    const incomingLocales = Object.keys(translationSourceMap);

    // Remove old translation map value if a new source for the same key is passed
    incomingLocales.forEach((locale) => this.clearTranslationSourceMapEntry(locale));

    this.translationSourceMap = {
      ...this.translationSourceMap,
      ...translationSourceMap,
    };

    // Reload existing locales that have been loaded already
    const loadedLocales = Object.keys(this.translationsMap);
    const localesToReload = incomingLocales.filter((locale) => loadedLocales.includes(locale));

    for (const locale of localesToReload) {
      this.fetchTranslation(locale)
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
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
