import React, {useEffect} from 'react';
import {connect} from "react-redux";
import Post from "./Post/Post";
import AddPostForm from "./AddPostForm";
import classes from './MyPosts.module.css'
import {
  addComment,
  addLike,
  addPost, addReply,
  deleteComment,
  deletePost, deleteReply,
  getPosts,
  removeLike
} from "../../../redux/actions/post-action";
import {NavLink, withRouter} from "react-router-dom";
import {submit} from "redux-form";
import {compose} from "redux";

const MyPosts = ({
                   addPost, post: {posts}, getPosts, following, addLike, removeLike, userProfile, userId, addComment,
                   deletePost, deleteComment, submit, avatar, history, addReply, deleteReply
                 }) => {

  useEffect(() => {
    getPosts(userProfile._id)
  }, [getPosts, userProfile._id])

  const addPostClickHandler = fields => {
    addPost({text: fields.post, profile: userProfile._id})
  }

  return (
    <div className={classes.postsWrapper}>
      <div className={classes.addPost + ' ' + classes.postsBlock}>
        <AddPostForm onSubmit={addPostClickHandler}/>
      </div>
      <div>
        <div className={classes.posts}>
          {posts.map((p, index) => (
            <Post postInfo={p} key={index} addLike={addLike} removeLike={removeLike} addComment={addComment}
                  deleteComment={deleteComment} userId={userId} userProfile={userProfile} deletePost={deletePost}
                  submit={submit} avatar={avatar} history={history} addReply={addReply} deleteReply={deleteReply}/>
          ))}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    post: state.post,
    userId: state.auth.userId,
    login: state.auth.login,
    avatar: state.auth.avatar,
    userProfile: state.profilePage.userProfile
  }
}

export default compose(
  connect(mapStateToProps, {
    addPost,
    getPosts,
    addLike,
    removeLike,
    addComment,
    deleteComment,
    addReply,
    deleteReply,
    submit,
    deletePost
  }),
  withRouter
)(MyPosts);



