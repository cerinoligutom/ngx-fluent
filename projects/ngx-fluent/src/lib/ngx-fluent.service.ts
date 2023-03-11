import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, catchError, of, lastValueFrom } from 'rxjs';
import { FluentBundle, FluentFunction, FluentResource, TextTransform } from '@fluent/bundle';

type FluentBundleOptions = {
  functions?: Record<string, FluentFunction>;
  useIsolating?: boolean;
  transform?: TextTransform;
};
type TranslationSourceMapParams = Record<
  string,
  | string
  | {
      path: string;
      bundleConfig?: FluentBundleOptions;
    }
>;

@Injectable({
  providedIn: 'root',
})
export class NgxFluentService {
  private locale = new BehaviorSubject<string | null>(null);

  private translationSourceMap: TranslationSourceMapParams = {};
  private translationsMap = new Map<string, FluentBundle | null>();

  localeChanges = this.locale.asObservable();

  constructor(private http: HttpClient) {}

  private fetchTranslation(locale: string) {
    // If we already have the translation, return it.
    const translationBundle = this.translationsMap.get(locale);
    if (translationBundle) {
      return of(translationBundle);
    }

    const localizedTranslationSourceMap = this.translationSourceMap[locale];

    let translationSourceUrl: string;
    let fluentBundleOptions: FluentBundleOptions;

    switch (typeof localizedTranslationSourceMap) {
      case 'string':
        translationSourceUrl = localizedTranslationSourceMap ?? '';
        break;

      case 'object':
        translationSourceUrl = localizedTranslationSourceMap.path ?? '';
        fluentBundleOptions = localizedTranslationSourceMap.bundleConfig ?? {};
        break;

      default:
        // If we don't have the translation, fetch it.
        translationSourceUrl = '';
        break;
    }

    return this.http.get(translationSourceUrl, { responseType: 'text' }).pipe(
      map((content) => {
        const bundle = new FluentBundle(locale, fluentBundleOptions);
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

  setTranslationSourceMap(translationSourceMap: TranslationSourceMapParams) {
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
