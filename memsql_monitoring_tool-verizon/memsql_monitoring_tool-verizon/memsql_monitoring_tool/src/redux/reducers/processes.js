import * as actionTypes from '../actions/actionTypes';

const initialState = {
  data: null,
  loading: false,
  error: null,
  active: [],
  maxTs: null
};

const processReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PROCESS_FETCH_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.PROCESS_FETCH_SUCCESS:
      return {
        ...state,
        data: action.data,
        loading: false,
        active: Object.keys(action.data),
        maxTs: state.maxTs < action.maxTs ? action.maxTs : state.maxTs
      };
    case actionTypes.PROCESS_FETCH_FAIL:
      return {
        ...state,
        error: action.error,
      };
    case actionTypes.PROCESS_CHANGE_ACTIVE:
      return {
        ...state,
        active: action.newActives,
      }
    case actionTypes.PROCESS_GET_LATEST_START:
        return {
          ...state,
          loading: true,
        };
    case actionTypes.PROCESS_GET_LATEST_SUCCESS:
      let newData = state.data
      Object.keys(action.data).map(el => {
        newData[el] = newData[el].slice(action.data[el].length).concat(action.data[el])
      })
      return {
        ...state,
        data: newData,
        maxTs: state.maxTs < action.maxTS ? action.maxTS : state.maxTS,
        loading: false,
      }
    default:
      return state;
  }
};

export default processReducer;
