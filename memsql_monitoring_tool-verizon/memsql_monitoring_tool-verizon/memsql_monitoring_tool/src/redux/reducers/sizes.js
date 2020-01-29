import * as actionTypes from "../actions/actionTypes";

const initialState = {
  data: null,
  activeTypes: [],
  activeDBs: [],
  databases: [],
  loading: false,
  error: null,
};

const sizesReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case actionTypes.SIZES_FETCH_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.SIZES_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        data: { ...actions.data.data },
        activeTypes: actions.data.activeTypes,
        activeDBs: actions.data.databases, //actions.data.activeDBs,
        databases: actions.data.databases,
      };
    case actionTypes.SIZES_FETCH_FAIL:
      return {
        ...state,
        loading: false,
        error: actions.error,
      };
    case actionTypes.CHANGE_SELECTED_DATABASES:
      return {
        ...state,
        activeDBs: actions.newSelection,
      };
    case actionTypes.CHANGE_SELECTED_TYPES:
      return {
        ...state,
        activeTypes: actions.newSelection,
      };
    default:
      return state;
  }
};

export default sizesReducer;
