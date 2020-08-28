import React from 'react';
import {connect} from "react-redux";
import MyRouter from "./myRouter";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Notification from "./components/Notification/Notification";
import Loader from "./components/UI/Loader/Loader";
import {initializeApp} from "./redux/actions/app-action";
import {setOffline} from "./redux/actions/auth-action";
import {
  clearNotifyReceivedMessage,
  deleteMessageSuccess,
  handleUserOnline,
  sendMessageSuccess,
  notifyReceivedMessage,
  setMessageReadSuccess,
  stopTyping,
  typing,
  createDialogSuccess,
  getDialogs,
  deleteDialogSuccess,
  editMessageSuccess
} from "./redux/actions/dialogs-action";
import socketEvents from "./socketEvents";
import './App.css';

class App extends React.Component {
  componentDidMount() {
    this.props.initializeApp();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isAuth !== this.props.isAuth) {
      if (this.props.isAuth) {
        this.props.initializeApp();
      }
    }

    if (prevProps.dialogs !== this.props.dialogs) {
      getDialogs()
    }

    if (prevProps.socket !== this.props.socket || prevProps.dialogsPage !== this.props.dialogsPage) {
      if (this.props.socket) {
        socketEvents(this.props.socket, this.props)
      }
    }
  }

  render() {
    if (!this.props.initialized) {
      return <Loader/>
    }

    return (
      <div className="App">
        <Header/>
        <div className="App-content">
          {this.props.isAuth ? <Navbar/> : <Login/>}
          <MyRouter/>
        </div>
        {this.props.messagesToNotify.length > 0 && <Notification/>}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    initialized: state.app.initialized,
    userId: state.auth.userId,
    isAuth: state.auth.isAuth,
    dialogs: state.dialogsPage.dialogs,
    dialogsPage: state.dialogsPage,
    activeDialogId: state.dialogsPage.activeDialogId,
    messagesToNotify: state.dialogsPage.messagesToNotify,
    socket: state.auth.socket
  }
}

export default connect(mapStateToProps, {
  sendMessageSuccess, clearNotifyReceivedMessage, notifyReceivedMessage, typing, setOffline, getDialogs,
  deleteMessageSuccess, setMessageReadSuccess, stopTyping, handleUserOnline, initializeApp, createDialogSuccess,
  deleteDialogSuccess, editMessageSuccess
})(App);
