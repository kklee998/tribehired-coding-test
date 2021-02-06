import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { searchComments, getSortedPostsWithAllComments } from './functions'

async function root (fastify: FastifyInstance, options: RouteShorthandOptions) {
  fastify.get('/', options, async (request, reply) => {
    reply.send({ msg: 'API is up.' })
  })
}

async function getPostComments (fastify: FastifyInstance, options: RouteShorthandOptions) {
  fastify.get('/posts', options, async (request, reply) => {
    try {
      const data = await getSortedPostsWithAllComments()
      reply.send({ data })
    } catch (error) {
      fastify.log.error({ error })
      reply.send(error)
    }
  })
}

async function search (fastify: FastifyInstance, options: RouteShorthandOptions) {
  fastify.get('/search', options, async (request, reply) => {
    try {
      const data = await searchComments('qui')
      reply.send({ data })
    } catch (error) {
      fastify.log.error({ error })
      reply.send(error)
    }
  })
}

export { root, getPostComments, search }
