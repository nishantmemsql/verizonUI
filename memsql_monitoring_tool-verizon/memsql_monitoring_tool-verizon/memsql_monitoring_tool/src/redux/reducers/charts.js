//import {combineReducers} from 'redux'
import * as actionTypes from "../actions/actionTypes";

// TODO: divide the reducer

const initialState = {
  memory_breakdown: {
    data: null,
    original: null,
    active: null,
    loading: false,
    error: null,
    options: [],
  },
  cpu_usage: {
    data: null,
    active: null,
    loading: false,
    error: null,
    options: [],
  },
  disk_usage: {
    data: null,
    active: null,
    loading: false,
    error: null,
    options: [],
  },
  memory_usage: {
    data: null,
    active: null,
    loading: false,
    error: null,
    options: [],
  },
  cpu_runq: {
    data: null,
    active: null,
    loading: false,
    error: null,
    options: [],
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MEMORY_BREAKDOWN_FETCH_START:
      return {
        ...state,
        memory_breakdown: {
          ...state.memory_breakdown,
          loading: true,
          error: null,
        },
      };
    case actionTypes.MEMORY_BREAKDOWN_FETCH_SUCCESS:
      return {
        ...state,
        memory_breakdown: action.data,
      };
    case actionTypes.MEMORY_BREAKDOWN_FETCH_FAIL:
      return {
        ...state,
        memory_breakdown: {
          ...state.memory_breakdown,
          error: action.error,
          loading: false
        },
      };
    case actionTypes.CHANGE_ACTIVE_MEMORY_BREAKDOWN:
      return {
        ...state,
        memory_breakdown: {
          ...state.memory_breakdown,
          active: action.newValue,
        },
      };

    case actionTypes.CPU_USAGE_FETCH_START:
      return {
        ...state,
        cpu_usage: {
          ...state.cpu_usage,
          loading: true,
        },
      };
    case actionTypes.CPU_USAGE_FETCH_SUCCESS:
      return {
        ...state,
        cpu_usage: action.data,
      };
    case actionTypes.CPU_USAGE_FETCH_FAIL:
      return {
        ...state,
        cpu_usage: {
          ...state.cpu_usage,
          error: action.error,
          loading: false,
        },
      };
    case actionTypes.CHANGE_ACTIVE_CPU_USAGE:
      return {
        ...state,
        cpu_usage: {
          ...state.cpu_usage,
          active: action.newValue,
        },
      };
    case actionTypes.DISK_USAGE_FETCH_START:
      return {
        ...state,
        disk_usage: {
          ...state.cpu_usage,
          loading: true,
        },
      };
    case actionTypes.DISK_USAGE_FETCH_SUCCESS:
      return {
        ...state,
        disk_usage: action.data,
      };
    case actionTypes.DISK_USAGE_FETCH_FAIL:
      return {
        ...state,
        disk_usage: {
          ...state.disk_usage,
          error: action.error,
          loading: false
        },
      };
    case actionTypes.CHANGE_ACTIVE_DISK_USAGE:
      return {
        ...state,
        disk_usage: {
          ...state.disk_usage,
          active: action.newValue,
        },
      };
    case actionTypes.MEMORY_USAGE_FETCH_START:
      return {
        ...state,
        memory_usage: {
          ...state.memory_usage,
          loading: true,
        },
      };
    case actionTypes.MEMORY_USAGE_FETCH_SUCCESS:
      return {
        ...state,
        memory_usage: action.data,
      };
    case actionTypes.MEMORY_USAGE_FETCH_FAIL:
      return {
        ...state,
        memory_usage: {
          ...state.memory_usage,
          error: action.error,
          loading: false
        },
      };
    case actionTypes.CHANGE_ACTIVE_MEMORY_USAGE:
      return {
        ...state,
        memory_usage: {
          ...state.memory_usage,
          active: action.newValue,
        },
      };
    case actionTypes.CPU_RUNQ_FETCH_START:
        return {
          ...state,
          cpu_runq: {
            ...state.cpu_runq,
            loading: true,
          },
        };
      case actionTypes.CPU_RUNQ_FETCH_SUCCESS:
        return {
          ...state,
          cpu_runq: action.data,
        };
      case actionTypes.CPU_RUNQ_FETCH_FAIL:
        return {
          ...state,
          cpu_runq: {
            ...state.cpu_runq,
            error: action.error,
            loading: false
          },
        };
      case actionTypes.CHANGE_ACTIVE_CPU_RUNQ:
        return {
          ...state,
          cpu_runq: {
            ...state.cpu_runq,
            active: action.newValue,
          },
        };
      default:
        return state;
  }
};

export default reducer;
