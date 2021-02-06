import { FastifyInstance, RequestGenericInterface } from 'fastify'
import { searchComments, getSortedPostsWithAllComments } from './functions'

interface CommentsRequest extends RequestGenericInterface {
  Querystring: {
    s: string
  }
}

interface PostRequest extends RequestGenericInterface {
  Querystring: {
    sort: string
  }
}

async function root (fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    reply.send({ msg: 'API is up.' })
  })
}

async function getPostComments (fastify: FastifyInstance) {
  fastify.get<PostRequest>('/posts', async (request, reply) => {
    try {
      const { query: { sort = 'DESC' } } = request
      const data = await getSortedPostsWithAllComments(sort)
      reply.send({ data })
    } catch (error) {
      fastify.log.error({ error })
      reply.send(error)
    }
  })
}

async function comments (fastify: FastifyInstance) {
  fastify.get<CommentsRequest>('/comments', async (request, reply) => {
    try {
      const { query: { s = '' } } = request
      const data = await searchComments(s)
      reply.send({ data })
    } catch (error) {
      fastify.log.error({ error })
      reply.send(error)
    }
  })
}

export { root, getPostComments, comments }
