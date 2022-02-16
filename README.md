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

<dt>Dependency injection</dt>
  <dd>
    Use the technique dependency injection for code not be coupled and make easy to mock dependencies during the tests.
  </dd>

<dt>Web Framework</dt>
  <dd>
    Use <a href="https://www.npmjs.com/package/fastify">Fastify</a> for requests routing and middlewares.
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
