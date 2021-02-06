import fastify from 'fastify'
import { getPostComments, comments, root } from './controllers'

function build (opts = {}) {
  const app = fastify(opts)

  app.register(getPostComments)
  app.register(comments)
  app.register(root)

  return app
}

export default build
