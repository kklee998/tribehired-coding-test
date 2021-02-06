import fastify, { FastifyInstance } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { getPostComments, search, root } from './app'

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
  logger: true
})

server.register(getPostComments)
server.register(search)
server.register(root)

server.listen(8080, (err, address) => {
  if (err) {
    server.log.error({ err })
    process.exit(1)
  }
  server.log.info(`Server listening at ${address}`)
})
