import * as actionTypes from "../actions/actionTypes";

const initialState = {
  skew: {
    data: null,
    loading: false,
    error: null
  },
  memoryBreakdown: {
    data: null,
    loading: false,
    error: null,
  }
};

const tableDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SKEW_FETCH_START:
      return {
        ...state,
        skew: {
          ...state.skew,
          loading: true,
        }
      };
    case actionTypes.SKEW_FETCH_SUCCESS:
      return {
        ...state,
        skew: {
          ...state.skew,
          loading: false,
          data: action.data,
        }
      };
    case actionTypes.SKEW_FETCH_FAIL:
      return {
        ...state,
        skew: {
          ...state.skew,
          loading: false,
          error: action.error,
        }
      };
    case actionTypes.CURRENT_MEMORY_BREAKDOWN_FETCH_START:
      return {
        ...state,
        memoryBreakdown: {
          ...state.memoryBreakdown,
          loading: true
        }
      }
    case actionTypes.CURRENT_MEMORY_BREAKDOWN_FETCH_SUCCESS:
      return {
        ...state,
        memoryBreakdown: {
          ...state.memoryBreakdown,
          loading: false,
          data: action.data
        }
      }
    case actionTypes.CURRENT_MEMORY_BREAKDOWN_FETCH_FAIL:
      return {
        ...state,
        memoryBreakdown: {
          ...state.memoryBreakdown,
          loading: false,
          error: action.error
        }
      }
    default:
      return state;
  }
};

export default tableDataReducer;
