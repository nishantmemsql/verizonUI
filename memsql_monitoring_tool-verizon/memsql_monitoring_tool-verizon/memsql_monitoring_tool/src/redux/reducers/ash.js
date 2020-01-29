import * as actionTypes from "../actions/actionTypes";

const initialState = {
  memoryBreakdown: {
    data: null,
    loading: false,
    error: null,
    timestamps: null,
    types: null,
  },
  ashReport: {
    data: null,
    loading: false,
    error: null,
    types: null,
  },
  activeProcesses: {
    data: null,
    loading: false,
    error: null,
    types: null,
  },
  clusterStats: {
    data: null,
    loading: false,
    error: null,
    types: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ASH_MEMORY_BREAKDOWN_GET_LATEST_START:
      return {
        ...state,
        memoryBreakdown: {
          ...state.memoryBreakdown,
          loading: true,
        },
      };
    case actionTypes.ASH_MEMORY_BREAKDOWN_GET_LATEST_SUCCESS:
      return {
        ...state,
        memoryBreakdown: {
          ...state.memoryBreakdown,
          loading: false,
          data: action.data,
          timestamps: action.timestamps,
          types: action.types,
        },
      };
    case actionTypes.ASH_MEMORY_BREAKDOWN_GET_LATEST_FAIL:
      return {
        ...state,
        memoryBreakdown: {
          ...state.memoryBreakdown,
          loading: false,
          error: action.error,
        },
      };
    case actionTypes.ASH_REPORT_FETCH_START:
      return {
        ...state,
        ashReport: {
          ...state.ashReport,
          data: null,
          loading: true,
        },
      };
    case actionTypes.ASH_REPORT_FETCH_SUCCESS:
      return {
        ...state,
        ashReport: {
          ...state.ashReport,
          loading: false,
          data: action.data,
          types: action.types,
        },
      };
    case actionTypes.ASH_REPORT_FETCH_FAIL:
      return {
        ...state,
        ashReport: {
          ...state.ashReport,
          loading: false,
          error: action.error,
        },
      };
    case actionTypes.PROCESS_LIST_FETCH_START:
      return {
        ...state,
        activeProcesses: {
          ...state.activeProcesses,
          loading: true,
          error: false,
        },
      };
    case actionTypes.PROCESS_LIST_FETCH_SUCCESS:
      return {
        ...state,
        activeProcesses: {
          ...state.activeProcesses,
          loading: false,
          error: false,
          data: action.data,
          types: action.types,
        },
      };
    case actionTypes.PROCESS_LIST_FETCH_FAIL:
      return {
        ...state,
        activeProcesses: {
          ...state.activeProcesses,
          loading: false,
          error: action.error,
        },
      };
    case actionTypes.CLUSTER_STATS_FETCH_START:
      return {
        ...state,
        clusterStats: {
          ...state.clusterStats,
          loading: true,
        },
      };
    case actionTypes.CLUSTER_STATS_FETCH_SUCCESS:
      return {
        ...state,
        clusterStats: {
          ...state.clusterStats,
          loading: false,
          error: false,
          data: action.data,
          types: action.types,
        },
      };
    case actionTypes.CLUSTER_STATS_FETCH_FAIL:
      return {
        ...state,
        clusterStats: {
          ...state.clusterStats,
          loading: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
};

export default reducer;
