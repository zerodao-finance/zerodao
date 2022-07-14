import _ from "lodash";

export const TransactionReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        pending: {
          ...state.pending,
          [action.payload.type]: [
            ...state.pending[action.payload.type],
            action.payload.data,
          ],
        },
      };
    case "COMPLETE":
      var updateData = state.pending[action.payload.type].filter(
        (t) => t.id != action.payload.id
      );
      console.log(updateData, action.payload);
      return {
        ...state,
        pending: { ...state.pending, [action.payload.type]: updateData },
        completed: {
          ...state.completed,
          [action.payload.type]: [
            ...state.completed[action.payload.type],
            action.payload.data,
          ],
        },
      };
    case "KILL":
      var updateData = state.pending[action.payload.type].filter(
        (t) => t.id != action.payload.id
      );
      return {
        ...state,
        pending: { ...state.pending, [action.payload.type]: updateData },
      };
    case "DB_ADD_COMPLETED":
      return {
        ...state,
        completed: {
          ...state.completed,
          [action.payload.type]: [
            ...state.completed[action.payload.type],
            ...action.payload.data,
          ],
        },
      };
    case "DB_ADD_PENDING":
      return {
        ...state,
        pending: {
          ...state.pending,
          [action.payload.type]: [
            ...state.pending[action.payload.type],
            ...action.payload.data,
          ],
        },
      };
    case "INIT":
      return action.payload;
  }
};
