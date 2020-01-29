import * as actionTypes from "../actions/actionTypes";

const initialState = {
  data: [],
  filter_data: {},
  configs: {},
  cluster: null,
  cluster_info: {},
  fromTs: null,
  toTs: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "SET_FILTER": {
      const { filter } = action.payload;
      const { table_id } = filter;

      return {
        ...state,
        filter_data: {
          ...state.filter_data,
          [table_id]: {
            ...state.filter_data[table_id],
            [Object.keys(filter)[0]]: filter[Object.keys(filter)[0]],
          },
        },
      };
    }
    case "SET_DATA": {
      const { id, dataLoaded } = action.payload.data;

      return { ...state, data: { ...state.data, [id]: dataLoaded } };
    }
    case "SET_CLUSTER": {
      let cluster = action.payload.data;
      return { ...state, cluster: cluster };
    }
    case "SET_CLUSTER_INFO": {
      let cluster_info = action.payload.data;
      const storedCluster = action.payload.storedCluster;
      return {
        ...state,
        cluster_info: cluster_info,
        cluster: (cluster_info[storedCluster] && storedCluster) || "",
      };
    }
    case actionTypes.SET_FROM_TS:
      return {
        ...state,
        fromTs: action.fromTs,
      };
    case actionTypes.SET_TO_TS:
      return {
        ...state,
        toTs: action.toTs,
      };
    default:
      return state;
  }
}
