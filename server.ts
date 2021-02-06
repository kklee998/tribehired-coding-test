import { FastifyInstance } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import build from './app'

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = build({
  logger: true
})

server.listen(8080, (err, address) => {
  if (err) {
    server.log.error({ err })
    process.exit(1)
  }
  server.log.info(`Server listening at ${address}`)
})
