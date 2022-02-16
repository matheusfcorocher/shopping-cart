import fastify from 'fastify'

const app = fastify()

app.get('/ping', async (request, reply) => {
  return 'pong\n'
})

export {app};

