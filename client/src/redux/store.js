import {applyMiddleware, compose, createStore} from "redux";
import thunk from 'redux-thunk'
import io from "socket.io-client";
import rootReducer from "./reducers/rootReducer";
import setAuthToken from "../utils/setAuthToken";
import {setSocket} from "./actions/auth-action";

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

let currentState = store.getState();

store.subscribe(() => {
  const previousState = currentState;
  currentState = store.getState();
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }

  if (currentState.auth.isAuth && !currentState.auth.socket) {
    const socket = io()

    if (currentState.auth.isAuth) {
      const userId = currentState.auth.userId;
      socket.emit('sign in', userId)
    }

    store.dispatch(setSocket(socket))
  }
});

export default store
