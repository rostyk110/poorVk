import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  ADD_COMMENT,
  REMOVE_COMMENT, LOGOUT, ADD_REPLY, DELETE_REPLY
} from '../types';

const initialState = {
  posts: [],
  loading: true,
  error: {}
};

export default function (state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.id ? {...post, likes: payload.likes} : post
        ),
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === payload.postId) {
            return {...post, comments: [...post.comments, payload.comment]}
          } else {
            return post
          }

        }),
        loading: false
      };
    case ADD_REPLY:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === payload.postId) {
            const commentIndex = post.comments.findIndex(c => c._id === payload.commentId)
            post.comments[commentIndex].replies = [...post.comments[commentIndex].replies, payload.reply]
            return {...post}
          } else {
            return post
          }
        }),
        loading: false
      };
    case REMOVE_COMMENT:
      const newPosts = state.posts.map(post => {
        if (post._id === payload.postId) {
          return {
            ...post, comments: post.comments.filter(comment => {
              return comment._id !== payload.commentId
            })
          }
        }
        return post
      })
      return {
        ...state,
        posts: newPosts,
        loading: false
      };
    case DELETE_REPLY:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === payload.postId) {
            const newComments = post.comments.map(c => {
              if (c._id === payload.commentId) {
                return {
                  ...c,
                  replies: c.replies.filter(r => r._id !== payload.replyId)
                }
              } else {
                return c
              }
            })
            return {...post, comments: newComments}
          } else {
            return post
          }
        }),
        loading: false
      };
    case LOGOUT:
      return {
        posts: [],
        loading: true,
        error: {}
      }
    default:
      return state;
  }
}
