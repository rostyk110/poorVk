import React, {useEffect} from 'react';
import {withAuthRedirect} from "../hoc/WithAuthRedirect/withAuthRedirect";
import {compose} from "redux";
import {connect} from "react-redux";

const News = ({isAuth}) => {
  useEffect(() => {
    document.title = "News"
  }, [])

  return (
    <h1>News</h1>
  )
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})

export default compose(
  connect(mapStateToProps),
  withAuthRedirect
)(News)
