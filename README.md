<div align="center">
    <img src="static/assets/img/moliorlogo_large.png" />
    <h1>molior-web</h1>
    <p>
        The purpose of molior is to build Debian packages out of git repositories based on a mirror of a specific Debian version and therefore creating reproducible builds. Build environments are structured into projects and versions, which may include mirrors and versions of other projects.
    </p>

    Molior performs the following tasks:
    <ul>
        <li>create mirrors of Debian repositories</li>
        <li>create projects based on a Debian mirror, include dependencies to other projects or mirrors</li>
        <li>build packages into project repositories (i386, amd64, armhf, arm64)</li>
        <li>create deployments of projects (ISO Installer, VirtualBox, images, ...)</li>
    </ul>
</div>

<h1 align="center">Frontend</h1>

## Requirements

- NodeJS (>=6.0)
- npm

## Development

For frontend development [VSCode](https://code.visualstudio.com/) is recommended (but not needed).

### Login into Development Environment

1. Open your vagrant box

Clone the molior repo (not this repo here) and run the following commands in it:
```bash
vagrant up molior
vagrant ssh molior
```

Then run:
```bash
cd molior-web
```

2. Run Webpack in watch mode inside vagrant box.

Everytime when you change a file, webpack will automatically compile the application and copies the files to the /var/www/molior-web

```bash
npm run dev-server

```

### Linter

Run the following command, to check the HTML & JavaScript code. Always check the linter, before committing!

```bash
npm run lint
```

### ngdoc

sTo generate the documentation, run the following command.

View the documentation with SimpleHTTPServer (Python required).

```bash
cd doc/molior-web/
python -m SimpleHTTPServer 8000
```

### Style Guide

Try to follow [this style guide](https://github.com/toddmotto/angularjs-styleguide) good as possible

## Test

### Run

#### Development

Runs the tests in Chrome Headless and Google Chrome in watch mode. Thats means everytime a file change gets detected, the tests will run automatically again.

```bash

npm test

```

#### Production

Runs the tests once in Chrome Headless.

```bash

npm run test-production

```

### Technologies

- [Jasmine](https://jasmine.github.io/) Behaviour driven JavaScript testing framework
- [Mocha](https://mochajs.org/) JavaScript Test Runner
- [Google Chrome](https://github.com/karma-runner/karma-chrome-launcher) Google Chrome for development testing
- [Karma Coverage](https://github.com/karma-runner/karma-coverage) Keeps track of the testcoverage
- [Babel](https://github.com/babel/karma-babel-preprocessor) Precompiles ES6 to ES5. Because PhantomJS does not support ES6 at the moment
