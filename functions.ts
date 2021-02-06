/* eslint-disable camelcase */
import lunr from 'lunr'
import axios from 'axios'

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'
const COMMENTS_URL = 'https://jsonplaceholder.typicode.com/comments'

interface Comment {
  comment_url: string;
  comment_body: string;
}

interface PostComments {
  post_id: number;
  post_title: string;
  post_body: string;
  total_number_of_comments: number;
  comments: Array<Comment>;
}
async function getAllCommentsOfPost (post: { id: any; title: any; body: any }) {
  try {
    const { id, title, body } = post
    const commentsUrl = `${POSTS_URL}/${id}/comments`
    const { data: comments } = await axios.get(commentsUrl)
    const obj: PostComments = {
      post_id: id,
      post_title: title,
      post_body: body,
      total_number_of_comments: comments.length,
      comments: comments.map((c: { id: any; body: any }) => (
        {
          comment_url: `${COMMENTS_URL}/${c.id}`,
          comment_body: c.body
        }))
    }
    return obj
  } catch (error) {
    console.error(error)
  }
}

const numberOfCommentsASC = (
  a: { total_number_of_comments: number },
  b: { total_number_of_comments: number }
) => a.total_number_of_comments - b.total_number_of_comments
const numberOfCommentsDESC = (
  a: { total_number_of_comments: number },
  b: { total_number_of_comments: number }
) => b.total_number_of_comments - a.total_number_of_comments

async function getSortedPostsWithAllComments (sort = 'ASC') {
  try {
    const { data: posts } = await axios.get(POSTS_URL)
    const postComments: Array<PostComments> = await Promise.all(posts.map(getAllCommentsOfPost))
    let sortedPostComments = [...postComments]
    switch (sort) {
      case 'ASC':
        sortedPostComments = [...postComments].sort(numberOfCommentsASC)
        break
      case 'DESC':
        sortedPostComments = [...postComments].sort(numberOfCommentsDESC)
        break
      default:
        break
    }

    return sortedPostComments
  } catch (error) {
    console.error(error)
  }
}

async function searchComments (s: string) {
  try {
    const { data: comments } = await axios.get(COMMENTS_URL)
    const idx = lunr(function () {
      this.ref('id')
      this.field('body')

      comments.forEach((doc: any) => {
        this.add(doc)
      }, this)
    })

    const searchRes = idx.search(s)
    const res = comments.filter((c: { id: number }) => searchRes.some((s: { ref: string }) => c.id === Number(s.ref)))

    return res
  } catch (error) {
    console.error(error)
  }
}

export { searchComments, getSortedPostsWithAllComments }
