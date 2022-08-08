# ngx-fluent

An [Angular](https://angular.io/) library for [Fluent](https://projectfluent.org/).

## Angular compatibility

Latest version available for each version of Angular

| Angular | @zeferinix/ngx-fluent | @fluent/bundle |
|---------|-----------------------|----------------|
| 13.x    | >= 1.0                | < 1.x          |
| 14.x    | >= 1.1                | < 1.x          |

## Installation

```bash
npm install --save @fluent/bundle @zeferinix/ngx-fluent 
```

## Usage

### Initialize module

Import the library into your app module:

```ts
import { NgxFluentModule } from '@zeferinix/ngx-fluent';

@NgModule({
  imports: [
    // ... your other module imports
    NgxFluentModule,
  ],
})
```

### Register locale source mapping and initial locale

The library needs to know where to locate the `.ftl` files so you have to provide this first (preferably on the root of your app such as `app.component.ts`) by providing a flat object where the `key` is the `locale` code and the `value` is the `source` then passing this object to the `setTranslationSourceMap()` method of the service.

```ts
import { Component, OnInit } from '@angular/core';
import { NgxFluentService } from '@zeferinix/ngx-fluent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private fluentService: NgxFluentService) {}

  ngOnInit() {
    this.fluentService.setTranslationSourceMap({
      en: 'assets/i18n/en.ftl', // could be on your assets folder
      sv: 'https://my.domain.com/translations/sv.ftl', // or external provided you don't get CORS issues
    });

    this.fluentService.setLocale('en');  // set initial locale
  }
}
```

### Switching locale

Switching to another language is as simple as calling the `setLocale()` method and passing the new locale.

```ts
export class MyComponent {
  switchLocale(locale: string) {
    this.fluentService.setLocale(locale);
  }
}
```

### Pipe

Use the `fluent` pipe.

```angular
{{ 'welcome-user' | fluent: { user: 'John Done' } }}
```

*Note: The pipe will return the key if it fails to resolve.*

### Programmatically via service

You can call the `translate()` method on the service to translate a message by passing the message key and optional arguments for interpolation.

*Note: The service will return `null` if it fails to resolve.*

```ts
export class MyComponent {
  async translate(key: string, args?: Record<string, any>) {
    const translation = await this.fluentService.translate(key, args);
    console.log(translation);
    return translation;
  }
}
```

## Contributing

See [Contributing Guide](/CONTRIBUTING.md).
