import {postAPI} from '../../api/api';
import {reset} from 'redux-form';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  ADD_COMMENT,
  REMOVE_COMMENT, ADD_REPLY, DELETE_REPLY
} from '../types';

// Get posts
export const getPosts = userId => async dispatch => {
  try {
    const res = await postAPI.getPosts(userId);

    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add like
export const addLike = id => async dispatch => {
  try {
    const res = await postAPI.like(id);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove like
export const removeLike = id => async dispatch => {
  try {
    const res = await postAPI.dislike(id);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete post
export const deletePost = id => async dispatch => {
  try {
    await postAPI.deletePost(id);

    dispatch({
      type: DELETE_POST,
      payload: id
    });

    // dispatch(setAlert('Post Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add post
export const addPost = formData => async dispatch => {
  try {
    const res = await postAPI.createPost(formData);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(reset('posts'))

    // dispatch(setAlert('Post Created', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add comment
export const addComment = (postId, formData) => async dispatch => {
  try {
    const res = await postAPI.addComment(postId, formData);

    dispatch({
      type: ADD_COMMENT,
      payload: {comment: res.data, postId}
    });

    dispatch(reset('comments'))
    // dispatch(setAlert('Comment Added', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add reply
export const addReply = (postId, commentId, formData) => async dispatch => {
  try {
    const res = await postAPI.addReply(postId, commentId, formData);

    dispatch({
      type: ADD_REPLY,
      payload: {reply: res.data, postId, commentId}
    });

    dispatch(reset('replies'))
  } catch (err) {
    console.log(err)
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    await postAPI.deleteComment(postId, commentId);

    dispatch({
      type: REMOVE_COMMENT,
      payload: {postId, commentId}
    });
  } catch (err) {
    console.log(err)
  }
};

// Delete reply
export const deleteReply = (postId, commentId, replyId) => async dispatch => {
  try {
    const res = await postAPI.deleteReply(postId, commentId, replyId);

    if (res.data.resultCode === 0) {
      dispatch({
        type: DELETE_REPLY,
        payload: {postId, commentId, replyId}
      });
    }
  } catch (err) {
    console.log(err)
  }
};
