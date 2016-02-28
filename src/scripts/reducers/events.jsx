export const CHILD_ADDED = '@surge/events/CHILD_ADDED';

const initialState = {};

export default function events(state = initialState, action) {
  switch(action.type) {
    case CHILD_ADDED:
      return {
        ...state,
        [action.event.id]: action.event
      };
    default:
      return state;
  }
}

export const addChild = (event) => {
  return {
    type: CHILD_ADDED,
    event
  };
}
