import * as actionTypes from './actionTypes';
import axios from 'axios';

const dateParser = (date) => {
  let time = date.replace('T', ' ').replace('Z', '')
  return time
}

function transformData(data) {
  let maxTs = "";
  let transformedData = {};
  data.map(entry => {
    let cluster = entry.cluster;
    if (!transformedData[cluster]) {
      transformedData[cluster] = [];
    }
    let formattedTs = dateParser(entry.ts)
    transformedData[cluster].push({ x: formattedTs, y: entry.runtime });
    if (formattedTs > maxTs) {
      maxTs = formattedTs
    }
  });
  return [transformedData, maxTs];
}

const benchmarkFetchStart = () => {
  return { type: actionTypes.BENCHMARK_FETCH_START };
};

const benchmarkFetchSuccess = (data, maxTs) => {
  return { type: actionTypes.BENCHMARK_FETCH_SUCCESS, data: data, maxTs: maxTs};
};

const benchmarkFetchFail = () => {
  return { type: actionTypes.BENCHMARK_FETCH_FAIL };
};

export const benchmarkFetch = (cluster, from, to) => {
  return dispatch => {
    dispatch(benchmarkFetchStart());
    axios.post("http://127.0.0.1:8000/api/",{'table_id':'benchmark', 'cluster': localStorage.getItem("cluster")?localStorage.getItem("cluster"):'ktymsqlitc11', 'filters':{'from':from,'to':to}})
      .then((response => {
        let [transformedData, maxTs] = transformData(response.data.data)
        dispatch(benchmarkFetchSuccess(transformedData, maxTs));
      }))
      .catch(error => {
        dispatch(benchmarkFetchFail(error.response));
      })

  };
};
