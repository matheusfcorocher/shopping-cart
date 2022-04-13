const swaggerOptions = {
  exposeRoute: true,
  routePrefix: "/api/docs",
  swagger: {
    info: {
      title: "Shopping_cart API end-points",
      description:
        "This documentation shows the end-points of shopping cart API",
      version: "1.0.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
  },
};

export { swaggerOptions };
