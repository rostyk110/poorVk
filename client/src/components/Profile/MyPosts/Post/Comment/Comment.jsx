import React, {useState} from 'react';
import classes from './Comment.module.css'
import deleteIcon from '../../../../../assets/images/deleteIcon.svg'
import {formatDate} from "../../../../../utils/utils-funcs";
import Reply from "./Reply/Reply";
import AddReplyForm from "./AddReplyForm";

const Comment = ({comment, history, submit, deleteComment, userId, postInfo, postId, avatar, addReply, deleteReply}) => {
  const [isReplied, setIsReplied] = useState(false)
  const [isClickedOnReplyName, setIsClickedOnReplyName] = useState(false)

  const addCommentClickHandler = fields => {
    addReply(postId, comment._id, {
      text: fields.reply,
      to: {id: comment.user}
    })
  }

  const goToProfile = () => {
    history.push(`/profile/${comment.user}`)
  }

  return (
    <>
      <div className={classes.comment + " " + (isClickedOnReplyName && classes.active)}>
        <div className={classes.avatar} onClick={goToProfile}>
          <img src={comment.user.avatar} alt="avatar"/>
        </div>
        <div className={classes.commentMain}>
          <div className={classes.userName} onClick={goToProfile}>{comment.user.fullName}</div>
          <div className={classes.commentText}>{comment.text}</div>
          <div className={classes.replyBlock}>
            <div className={classes.commentDate}>{formatDate(comment.date)}</div>
            <div className={classes.reply} onClick={() => setIsReplied(prev => !prev)}>Reply</div>
          </div>
        </div>
        <div className={classes.deleteComment}>
          {comment.user._id === userId   // || userProfile.user._id === userId  //my comment or my profile
            ? <img src={deleteIcon} alt="deleteIcon" onClick={() => deleteComment(postInfo._id, comment._id)}/>
            : null
          }
        </div>
      </div>
      <div>
          <div className={classes.replyList}>
            {comment.replies.map((reply, index) => <Reply key={index} reply={reply} history={history}
                                                          deleteReply={deleteReply} postId={postId} userId={userId}
                                                          commentId={comment._id}
                                                          setIsClickedOnReplyName={setIsClickedOnReplyName}/>)}
          </div>

          {isReplied && <div className={classes.replyWrapper}>
            <div className={classes.replyAvatar}>
              <img src={avatar} alt="avatar"/>
            </div>
            <div className={classes.replyForm}>
              <AddReplyForm onSubmit={addCommentClickHandler} submit={submit}/>
            </div>
          </div>}
      </div>
    </>
  )
}

export default Comment;
