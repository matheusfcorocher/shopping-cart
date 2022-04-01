"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesRoutes = void 0;
const service_1 = require("../controllers/handlers/service");
const service_2 = require("../controllers/schemas/service");
const checkoutOpts = {
    schema: service_2.checkoutSchema,
    handler: service_1.checkoutHandler,
};
const servicesRoutes = (fastify, options, done) => {
    fastify.post("/api/services/checkout", checkoutOpts);
    done();
};
exports.servicesRoutes = servicesRoutes;
