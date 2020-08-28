import {HANDLE_BURGER_MENU} from "../types";

const initialState = {
  isBurgerClicked: false
}

const sideBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case HANDLE_BURGER_MENU:
      return {
        isBurgerClicked: !state.isBurgerClicked
      }
    default:
      return state
  }
}

export default sideBarReducer;
