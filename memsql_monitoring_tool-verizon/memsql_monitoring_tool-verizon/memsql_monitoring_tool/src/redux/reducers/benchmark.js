import * as actionTypes from '../actions/actionTypes';

const initialState = {
  data: null,
  loading: false,
  error: null
}

const reducer = (state=initialState, action) => {
  switch (action.type){
    case actionTypes.BENCHMARK_FETCH_START:
      return {
        ...state,
        loading: true,
      }
    case actionTypes.BENCHMARK_FETCH_SUCCESS:
      return {
        ...state,
        data: action.data,
        loading: false,
      }
    case actionTypes.MEMORY_BREAKDOWN_FETCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return {
        ...state,
      }
  } 
}

export default reducer;