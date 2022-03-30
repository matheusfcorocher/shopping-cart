import fastify from 'fastify'
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

