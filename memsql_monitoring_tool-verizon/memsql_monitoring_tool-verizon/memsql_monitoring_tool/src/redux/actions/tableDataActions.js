import * as actionTypes from "./actionTypes";
import axios from "axios";
import skewData from "../../data/row_skew";
import { memoryBreakdownTableData } from "../../data/memory_breakdown_table";

const skewFetchStart = () => {
  return { type: actionTypes.SKEW_FETCH_START };
};

const skewFetchSuccess = data => {
  return { type: actionTypes.SKEW_FETCH_SUCCESS, data: data };
};

const skewFetchFail = error => {
  return { type: actionTypes.SKEW_FETCH_FAIL, error: error.response };
};

export const skewFetch = cluster => {
  console.log({ table_id: "skew", cluster: cluster });
  return dispatch => {
    dispatch(skewFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "skew",
        cluster: cluster,
      })
      .then(response => {
        console.log("skew", response.data);
        dispatch(skewFetchSuccess(response.data.data));
      })
      .catch(error => {
        dispatch(skewFetchFail(error));
        const skews = skewData.row_skew;
        dispatch(skewFetchSuccess(skews));
      });
  };
};

const currentMemoryBreakdownFetchStart = () => {
  return { type: actionTypes.CURRENT_MEMORY_BREAKDOWN_FETCH_START };
};

const currentMemoryBreakdownFetchSuccess = data => {
  return {
    type: actionTypes.CURRENT_MEMORY_BREAKDOWN_FETCH_SUCCESS,
    data: data,
  };
};

const currentMemoryBreakdownFetchFail = error => {
  return {
    type: actionTypes.CURRENT_MEMORY_BREAKDOWN_FETCH_FAIL,
    error: error.response,
  };
};

export const currentMemoryBreakdownFetch = () => {
  return dispatch => {
    dispatch(currentMemoryBreakdownFetchStart());
    const memoryBreakdown = memoryBreakdownTableData.memory_breakdown_table;
    dispatch(currentMemoryBreakdownFetchSuccess(memoryBreakdown));
  };
};
