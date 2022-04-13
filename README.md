# shopping-cart

This repository is backend service that must follow this requirements:

* um pra retornar a lista de produtos disponíveis e a quantidade deles em estoque
* um pra retornar o carrinho atual (quais produtos e quantos de cada produto tem nele, o cupom aplicado se tiver algum, e os valores de subtotal, frete, ...)
* um pra adicionar itens no carrinho (pode ser tanto adicionar a quantidade de um item já incluso, quando adicionar ele pela primeira vez)
* um pra remover itens do carrinho (esse é importante considerar o seguinte caso: se a nova quantidade for pra 0, a gente remove o item do carrinho)
* um pra aplicar um cupom ao carrinho
* um pra remover o cupom do carrinho
* um pra finalizar a compra

In short answer, must attend this gist: <a href="https://gist.github.com/talyssonoc/5b102985170a436bcf86ba00f929b889">Gist</a>

## Features

<dl>
  <dt>Clean Architecture</dt>
  <dd>
    This project architecture use principles of <a href="https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html">Clean Architecture</a> focused on codebase scalability.
  </dd>
  
  <dt>Domain Driven Design(DDD)</dt>
  <dd>
    Uses <a href="https://martinfowler.com/bliki/DomainDrivenDesign.html">DDD</a> approach to reduce domain complexity and focus the development in domain model.
  </dd>
  
  <dt>Uses Money Pattern</dt>
  <dd>
    Uses <a href="https://www.npmjs.com/package/dinero.js">Dinero.js</a> for money exchange that follows the <a href="https://martinfowler.com/eaaCatalog/money.html">Money Pattern</a> of Martin Fowler in the book Patterns of Enterprise Application Architecture.
  </dd>
  
  <dt>Dependency injection</dt>
  <dd>
    Use the technique dependency injection for code not be coupled and make easy to mock dependencies during the tests.
  </dd>

<dt>Web Framework</dt>
  <dd>
    Use <a href="https://www.npmjs.com/package/fastify">Fastify</a> for requests routing and middlewares. And also uses <a href="https://www.npmjs.com/package/fastify-swagger">fastify-swagger</a> for creating a doc with SwaggerUI. 
  </dd>

<dt>Database</dt>
  <dd>
    Use <a href="https://www.postgresql.org/">Postgres</a> as relational database. 
  </dd>

<dt>Database integration</dt>
  <dd>
    <a href="https://vincit.github.io/objection.js/">Objection</a>, an ORM for SQL databases, is already integrated. But needs to configure some aspects to use it.</a>
  </dd>

<dt>CLI integration</dt>
  <dd>
    Use <a href="https://www.npmjs.com/package/knex">Knex</a> for both the application and Objection have command-line tools to make it easy to work with them. Check the <a href="#scripts">Scripts</a> section to know more about this feature.
  </dd>

<dt>Configurations</dt>
  <dd>
    Use <a href="https://www.npmjs.com/package/config">Config</a> for easily switch development and test environments, <a href="https://www.npmjs.com/package/dotenv">Dotenv</a> package for loading environmental variables from .env file for config file. And uses <a href="https://www.npmjs.com/package/cross-env">Cross-env</a> to run linux commands style in any OS.
  </dd>

<dt>Prepared for testing</dt>
  <dd>
    The test suite uses <a href="https://www.npmjs.com/package/jest">Jest</a> as test runner and is prepared to run unit, integration and functional tests right from the beginning. In integration and functional testes use <a href="https://www.npmjs.com/package/supertest">Supertest</a> to make HTTP tests. There are helpers to make it easy to make requests to the web app during the tests and for cleaning the database after each test</a>.
  </dd>

<dt>Compile Tyscript to Javascript</dt>
  <dd>
    Use <a href="https://www.npmjs.com/package/ts-node-dev">ts-node-dev</a> for compile typescript code to javascript to NodeJS runs it. And also to automatically reload the server after a file change when on development mode, makes the development faster and easier
  </dd>
</dl>

## Quick start

0. Do you need a POSTGRES server installed in your machine. I suggest to use this tools: <a href="https://www.electronjs.org/apps/postbird">Postbird</a> for verify your Postgres Database and <a href="https://www.postman.com/">Postman</a> to access the routes of API.
1. Clone the repository with `git clone https://github.com/matheusfcorocher/shopping-cart.git`
2. Setup the database on `.env` and also `./src/infra/database/config.ts`.
3. Install the dependencies with `yarn` (click here if [you don't have Yarn installed](https://yarnpkg.com/docs/install)) in your bash terminal
4. Create the development and test databases you have setup on `./src/infra/database/config.ts`.
5. Run the database migrations with `yarn knex migrate:latest`. The default environment is dev. To create database for test, change development env for testing env.
6. Add some seed data to the development database with `knex seed:run`
7. Run the application in development mode with `yarn build` then `yarn start`
8. Access `http://localhost:5000/api/` and you're ready to go!

## Aditional info:
- Don't forget to run the migrations for the test environment as well (including when you create a new migration) with `yarn knex migrate:latest`

## Scripts

This api comes with a collection of npm scripts to make your life easier, you'll run them with `npm run <script name>` or `yarn <script name>`:

- `knex`: Run commands with knex.
- `build`: Transpile the ts files to js in builder folder.
- `start`: Start the development server with Node.js
- `tsnd`: Run a file with typescript ts-node-dev
- `test`: Run all tests suite with option --runInBand and NODE_ENV=test

## Endpoints of this api and requirements

1. To see all endpoints of this api, you should run `yarn build` then `yarn start`.
2. After initialize the server you go to address `http://localhost:5000/api/docs` to see all routes of api in Swagger UI.
