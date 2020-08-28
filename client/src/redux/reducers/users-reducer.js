import {
  ADD_SET_USERS,
  DELETE_IN_FOLLOWING_PROGRESS,
  FOLLOW,
  SET_CURRENT_PAGE, SET_IN_FOLLOWING_PROGRESS,
  SET_TOTAL_USERS_COUNT, SET_USERS,
  UNFOLLOW
} from "../types";

const initialState = {
  users: [],
  pageSize: 10,
  totalUsersCount: 0,
  currentPage: 1,
  isInFollowingProgress: []
}

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FOLLOW:
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id === action.payload._id) {
            return {...action.payload, followed: true}
          }

          return user
        })
      }
    case UNFOLLOW:
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id === action.payload._id) {
            return {...user, followed: false}
          }
          return user
        })
      }
    case SET_USERS:
      return {
        ...state,
        ...action.payload
      }
    case ADD_SET_USERS:
      return {
        ...state,
        users: [...state.users, ...action.payload.users],
        totalUsersCount: action.payload.totalUsersCount
      }
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      }
    case SET_TOTAL_USERS_COUNT:
      return {
        ...state,
        totalUsersCount: action.payload
      }
    case SET_IN_FOLLOWING_PROGRESS:
      return {
        ...state,
        isInFollowingProgress: [...state.isInFollowingProgress, action.payload]
      }
    case DELETE_IN_FOLLOWING_PROGRESS:
      return {
        ...state,
        isInFollowingProgress: state.isInFollowingProgress.filter(id => id !== action.payload)
      }
    default:
      return state
  }
}

export default usersReducer
