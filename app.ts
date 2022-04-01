import fastify from 'fastify';
import Ajv from "ajv";
import { container, Container } from './src/container';
import { cartsRoutes } from './src/interfaces/http/routes/cart';
import { productsRoutes } from './src/interfaces/http/routes/product';
import { servicesRoutes } from './src/interfaces/http/routes/service';
import { vouchersRoutes } from './src/interfaces/http/routes/voucher';


// this declaration must be in scope of the typescript interpreter to work
declare module 'fastify' {
  interface FastifyRequest { // you must reference the interface and not the type
    container: Container;
  }
}

const app = fastify()

//validation configs for fastify requests
const schemaCompilers : { [key: string]: any} = {
  body: new Ajv({
    removeAdditional: true,
    coerceTypes: false,
    allErrors: false,
  }),
  params: new Ajv({
    removeAdditional: true,
    coerceTypes: true,
    allErrors: false,
  }),
  querystring: new Ajv({
    removeAdditional: true,
    coerceTypes: true,
    allErrors: false,
  }),
  headers: new Ajv({
    removeAdditional: true,
    coerceTypes: true,
    allErrors: false,
  }),
};

app.setValidatorCompiler((req) => {
  if (!req.httpPart) {
    throw new Error("Missing httpPart");
  }
  const compiler = schemaCompilers[req.httpPart];
  if (!compiler) {
    throw new Error(`Missing compiler for ${req.httpPart}`);
  }
  return compiler.compile(req.schema);
});

//Aplying middleware in app request
app.decorateRequest("container", null);

app.addHook("onRequest", async (req, reply) => {
  req.container = container;
});

app.register(cartsRoutes);
app.register(productsRoutes);
app.register(servicesRoutes);
app.register(vouchersRoutes);

export {app};

