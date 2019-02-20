import { FETCH_LAWTYPES } from "./constants";
import * as entityNormalize from "~/utils/entityNormalize";

const initialState = {
  isPending: false,
  isFulfilled: false,
  isRejected: false,
  data: {},
  ids: []
};

function lawtypes(state = initialState, action) {
  switch (action.type) {
    case `${FETCH_LAWTYPES}_PENDING`:
      return {
        ...state,
        isPending: true
      };

    case `${FETCH_LAWTYPES}_FULFILLED`:
      const entity = entityNormalize.toObject(action.payload.results);

      return {
        ...state,
        isPending: false,
        isFulfilled: true,
        ...entity
      };

    case `${FETCH_LAWTYPES}_REJECTED`:
      return {
        ...state,
        isRejected: true,
        isPending: false,
        error: action.payload
      };

    default:
      return state;
  }
}

export default lawtypes;
