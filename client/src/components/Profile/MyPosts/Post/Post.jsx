import React, {useState} from 'react';
import classes from './Post.module.css'
import {formatDate, isPostLiked} from "../../../../utils/utils-funcs";
import heart from '../../../../assets/images/heart.png'
import commentPicture from '../../../../assets/images/comment.png'
import threeDotsPicture from '../../../../assets/images/threeDots.png'
import Comment from "./Comment/Comment";
import AddCommentForm from "./AddCommentForm";

function Post({addReply, deleteReply, postInfo, history, userId, addLike, userProfile, deletePost, removeLike, deleteComment, submit, addComment, avatar}) {
  const [showCommentBlock, setShowCommentBlock] = useState(false)

  const addCommentClickHandler = fields => {
    addComment(postInfo._id, {text: fields.comment})
  }

  const goToProfile = () => {
    history.push(`/profile/${postInfo.user}`)
  }

  return (
    <div className={classes.post}>
      <div className={classes.container}>
        <div className={classes.userInfo}>
          <div className={classes.userInfoImage}>
            <img src={postInfo.user.avatar} alt="avatar" onClick={goToProfile}/>
            <div className={classes.postUserName}>
              <span className={classes.userName} onClick={goToProfile}>{postInfo.user.fullName}</span>
              <span className={classes.date}>{formatDate(postInfo.date)}</span>
            </div>
          </div>
          {
            (postInfo.user === userId || userProfile.user._id === userId)
            &&
            <div className={classes.threeDots}>
              <img src={threeDotsPicture} alt="threeDotsPicture"/>
              <div className={classes.threeDotsHoverMenu}>
                <div onClick={() => deletePost(postInfo._id)}>Delete post</div>
              </div>

            </div>
          }
        </div>

        <div className={classes.postText}>
          <span>{postInfo.text}</span>
        </div>

        <div>
          <div className={classes.likes}>
            <div className={classes.likesWithComments}>
            <span>
            {
              !isPostLiked(postInfo.likes, userId)
                ? <div className={classes.like} onClick={() => addLike(postInfo._id)}>
                  <img src={heart} alt="like"/>
                  <span>Like</span>
                </div>
                : <div className={classes.dislike} onClick={() => removeLike(postInfo._id)}>
                  <img src={heart} alt="dislike"/>
                  <span>Dislike</span>
                </div>
            }
          </span>
              <span>
              <div className={classes.commentPic} onClick={() => setShowCommentBlock(!showCommentBlock)}>
                  <img src={commentPicture} alt="coment"/>
                  <span>Comment</span>
                </div>
            </span>
            </div>
            <span className={classes.likesCounter}>likes: {postInfo.likes.length}</span>
          </div>
        </div>
      </div>
      <div className={classes.commentsBlock}>
          <div>
            {postInfo.comments.map((comment, index) => <Comment deleteReply={deleteReply} addReply={addReply} key={index} comment={comment} deleteComment={deleteComment} userId={userId}
                                                       postInfo={postInfo} history={history} avatar={avatar} postId={postInfo._id}/>)}
          </div>

          {showCommentBlock && <div className={classes.commentWrapper}>
            <div className={classes.avatar}>
              <img src={avatar} alt="avatar"/>
            </div>
            <div className={classes.commentForm}>
              <AddCommentForm onSubmit={addCommentClickHandler} submit={submit}/>
            </div>
          </div>}
      </div>
    </div>
  );
}

export default Post;
