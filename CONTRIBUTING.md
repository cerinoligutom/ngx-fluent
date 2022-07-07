# Contributing

When contributing to this repository, please first discuss the change you wish to make by opening a new issue on this repository.

## Projects

### ngx-fluent

An Angular library for [Fluent](https://projectfluent.org/).

### ngx-fluent-example

An Angular app to play with the `ngx-fluent` library locally.

## Local Development

Install dependencies

```bash
npm install
```

Prepare 2 terminals for:

- Building the `ngx-fluent` library in watch mode
- Running the `ngx-fluent-example` app

Build the library in watch mode

```bash
npm run build -- ngx-fluent --watch
```

Run the app

```bash
npm start
```

### Testing

Just simply run the command below.

```bash
npm test
```

If you're using WSL, Karma will throw an error stating that it cannot find chrome. Follow this [StackOverflow question](https://stackoverflow.com/questions/54090298/karma-use-windows-chrome-from-wsl) on how to resolve this but the main idea is you need to set an environment variable on your WSL that points to the host machine's Chrome executable.
