<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This NestJS application provides two main functionalities:

1. Event Mapper: Processes AWS SES inbound email events.
2. JSON Extractor: Extracts JSON content from email files.

## Project Setup

To set up the project, follow these steps:

```bash
# Clone the repository
$ git clone https://github.com/BryanCloudDev/designli-technical-test.git

# Navigate to the project directory
$ cd designli-technical-test

# Install dependencies
$ npm install
```

## Running the Application

You can run the application in different modes:

```bash
# Development mode
$ npm run start

# Watch mode (auto-reload on file changes)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

The app will run by default in port `3000`, the app can be cheked in `http://localhost:3000/api`

## Building the Application

To build the application for production:

```bash
$ npm run build
```

This will create a `dist` folder with the compiled JavaScript files.

## Running Tests

The project includes various test scripts:

```bash
# Run unit tests
$ npm run test

# Generate test coverage report
$ npm run test:cov
```

## Controllers

### Event Mapper Controller

- **Endpoint**: POST `/event-mapper`
- **Functionality**: Maps and processes an AWS SES inbound email event.
- **Input**: Receives an SES inbound email event (SNS-style payload) in the request body.
- **Output**: Returns a mapped or transformed structure of the event.
- **Response Codes**:
  - 200: Event processed successfully
  - 400: Validation failed for the provided SES event payload

### JSON Extractor Controller

- **Endpoint**: GET `/json-extractor`
- **Functionality**: Extracts JSON content from a specified email file.
- **Input**: Requires a `file` query parameter specifying the name of the email file to parse (samples have been added to the postman documentation, the files are already loaded in `src/json-extractor/emails`).
- **Output**: Returns the extracted JSON content from the email file.
- **Response Codes**:
  - 200: Successful response with extracted JSON
  - 400: Bad request
  - 500: Internal server error

## Additional Information

- The application uses Swagger for API documentation. You can access the Swagger UI at `/api` when the application is running.
- For more detailed information about the NestJS framework, visit the [NestJS Documentation](https://docs.nestjs.com).
- A comprehensive Postman documentation for the API endpoints is available at [Postman Documentation](https://documenter.getpostman.com/view/15984313/2sB3dLTB7t).
