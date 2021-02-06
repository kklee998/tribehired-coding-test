import { test } from 'tap'
import build from '../app'

test('requests the "/" route', async t => {
  const app = build()

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })
  t.strictEqual(response.statusCode, 200, 'returns a status code of 200')
  t.deepEqual(response.json(), { msg: 'API is up.' })
})

test('requests the "/posts" route', async t => {
  const app = build()

  const response = await app.inject({
    method: 'GET',
    url: '/posts'
  })
  t.strictEqual(response.statusCode, 200, 'returns a status code of 200')
  t.type(response.json().data, Array)
  t.ok(response.json().data[0].post_id, 'has post_id')
  t.ok(response.json().data[0].post_title, 'has post_title')
  t.ok(response.json().data[0].post_body, 'has post_body')
  t.ok(response.json().data[0].total_number_of_comments, 'has total number of comments')
  t.ok(response.json().data[0].comments, 'has comments')
  t.ok(response.json().data[0].comments[0].comment_url, 'comments has comment_url')
  t.ok(response.json().data[0].comments[0].comment_body, 'comments has comment_body')
})

test('requests the "/comments" route', async t => {
  const app = build()

  const response = await app.inject({
    method: 'GET',
    url: '/comments'
  })
  t.strictEqual(response.statusCode, 200, 'returns a status code of 200')
  t.type(response.json().data, Array)
  t.equal(response.json().data.length, 500, 'returns 500 comments')
})

test('requests the "/comments" route', async t => {
  const app = build()

  const response = await app.inject({
    method: 'GET',
    url: '/comments',
    query: {
      s: 'qui'
    }
  })
  t.strictEqual(response.statusCode, 200, 'returns a status code of 200')
  t.type(response.json().data, Array)
  t.ok(response.json().data.length > 0, 'returns at least 1 result')
  t.ok(response.json().data.length < 500, 'does not return ALL the result')
  t.match(response.json().data[0].body, 'qui', 'body should have "qui" in it')
})
