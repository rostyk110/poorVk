import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {followUser, setCurrentPage, setSearchUsers, unfollowUser} from "../../redux/actions/users-action";
import UserInfo from "./UserInfo/UserInfo";
import Loader from "../UI/Loader/Loader";
import classes from './Users.module.css'
import SearchIcon from "../../assets/images/search_icon.png"
import {compose} from "redux";
import {withAuthRedirect} from "../hoc/WithAuthRedirect/withAuthRedirect";


const Users = props => {
  const {currentPage, pageSize, totalUsersCount, users, socket, userId, isLoading} = props
  const {setCurrentPage, setSearchUsers} = props
  const [text, setText] = useState('')

  const pagesCount = Math.ceil(totalUsersCount / pageSize)

  useEffect(() => {
    if (socket) {
      socket.emit('live search', userId, text, pageSize, 1)
    }
    document.title = "Friends"
  }, [])

  useEffect(() => {
    if (socket) {
      socket
        .off('live search bc')
        .on('live search bc', data => {
          if (currentPage > 1) {
            setSearchUsers(data, true)
          } else {
            setSearchUsers(data, false)
          }
        })
    }
  }, [currentPage, socket, setSearchUsers])

  useEffect(() => {
    setCurrentPage(1)
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalUsersCount, currentPage, users])

  const handleScroll = () => {
    const a = Math.round(window.innerHeight + document.documentElement.scrollTop)
    const b = Math.round(document.documentElement.offsetHeight)

    if (a === b && !isLoading) {
      if (pagesCount > currentPage && totalUsersCount !== users.length) {
        socket.emit('live search', userId, text, pageSize, currentPage + 1)
        setCurrentPage(currentPage + 1)
      }
    }
  }

  const handleSearchInput = e => {
    setText(e.target.value)
    socket.emit('live search', userId, e.target.value, pageSize, 1)
  }

  return (
    <>
      {
        <div className={classes.usersWrapper}>
          <div className={classes.usersWrapperHeader}>
            <div className={classes.headerTitle}>People</div>
            <div className={classes.headerUsersAmount}>{totalUsersCount}</div>
          </div>
          <div className={classes.searchWrapper}>
            <div className={classes.searchIcon}>
              <img src={SearchIcon} alt="SearchIcon"/>
            </div>
            <input type="text" placeholder="Search" onChange={handleSearchInput}/>
          </div>
          <div className={classes.usersBlock}>
            {users.map((user, index) => <UserInfo key={index} user={user} {...props}/>)}

            {isLoading && <Loader/>}
          </div>
        </div>
      }
    </>
  )
}

const mapStateToProps = state => {
  return {
    users: state.usersPage.users,
    totalUsersCount: state.usersPage.totalUsersCount,
    currentPage: state.usersPage.currentPage,
    socket: state.auth.socket,
    userId: state.auth.userId,
    isAuth: state.auth.isAuth,
    pageSize: state.usersPage.pageSize,
    isLoading: state.loader.isLoading,
    isInFollowingProgress: state.usersPage.isInFollowingProgress,
  }
}

export default compose(
  connect(mapStateToProps, {
    followUser,
    unfollowUser,
    setCurrentPage,
    setSearchUsers
  }),
  withAuthRedirect
)(Users)

