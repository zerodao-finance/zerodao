import _ from "lodash";

export const NotificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          ...action.payload,
        },
      ];
    case "UPDATE":
      var t = _.find(state, function (i) {
        return i.id == action.payload.id;
      });
      var updated = { ...t, ...action.payload.update };
      var l = state.filter((t) => t.id != action.payload.id);
      return [...l, updated];
    case "REMOVE_TRANSITION":
      // We use this to create a transition effect of
      // moving the card to the left off screen before
      // fully removing it from the state
      var toUpdate = _.find(state, function (i) {
        return i.id == action.payload.id;
      });
      if (!toUpdate) return state;
      var updatedCard = { ...toUpdate, out: true };
      var removedState = state.filter((t) => t.id != action.payload.id);
      return [updatedCard, ...removedState];
    case "REMOVE":
      if (state.length === 0) return [];
      return state.filter((t) => t.id != action.payload.id);
    case "REMOVE_ALL":
      return [];
    case "REMOVE_LAST":
      return _.initial(state);
    default:
      return state;
  }
};
