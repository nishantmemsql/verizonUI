import * as actionTypes from "./actionTypes";
import * as colorActions from './colorActions';

import axios from 'axios';
import threadData from "../../data/threads";
import newThreads from '../../data/new_threads';

const dateParser = (date) => {
  let time = date.replace('T', ' ').replace('Z', '')
  return time
}

function transformData(data) {
  let maxTs = "";
  let transformedData = {};
  data.map((entry, idx) => {
    let node = entry.host + ":" + entry.port;
    if (!transformedData[node]) {
      transformedData[node] = [];
    }
    let formattedTs = dateParser(entry.ts)
    transformedData[node].push({ x: formattedTs, y: entry.thread_count });
    if (formattedTs > maxTs) {
      maxTs = formattedTs
    }
  });
  return [transformedData, maxTs];
}

const threadsFetchStart = () => {
  return { type: actionTypes.THREAD_FETCH_START };
};

const threadsFetchSuccess = (data, maxTs) => {
  return { type: actionTypes.THREAD_FETCH_SUCCESS, data: data, maxTs: maxTs};
};

const threadsFetchFail = () => {
  return { type: actionTypes.THREAD_FETCH_FAIL };
};

export const threadsChangeActive = (newActives) => {
  return {type: actionTypes.THREAD_CHANGE_ACTIVE, newActives: newActives}
}

export const threadsFetch = (cluster, from, to) => {
  return dispatch => {
    dispatch(threadsFetchStart());
    axios.post("http://127.0.0.1:8000/api/",{'table_id':'threads', 'cluster': localStorage.getItem("cluster")?localStorage.getItem("cluster"):'ktymsqlitc11', 'filters':{'from':from,'to':to}})
      .then((response => {
        console.log("Thread fetch success", response)
        let [transformedData, maxTs] = transformData(response.data.data)
        dispatch(threadsFetchSuccess(transformedData, maxTs));
        //const sortedNodes = Object.keys(transformedData).sort()
        //dispatch(colorActions.addNodeColor(sortedNodes))
      }))
      .catch(error => {
        dispatch(threadsFetchFail(error.response));
        let [transformedData, maxTs] = transformData(threadData.threads)
        // failsafe for offline test
        dispatch(threadsFetchSuccess(transformedData, maxTs));
        //const sortedNodes = Object.keys(transformedData).sort()
        //dispatch(colorActions.addNodeColor(sortedNodes));
      })

  };
};

const threadsAddLatest = (data, maxTs) => {
  return {
    type: actionTypes.THREAD_GET_LATEST_SUCCESS,
    data: data,
    maxTs: maxTs,
  }
}

const threadsGetLatestStart = (data) => {
  return {
    type: actionTypes.THREAD_GET_LATEST_START,
    data: data,
  }
}

const threadsGetLatestFail = (error) => {
  return {
    type: actionTypes.THREAD_GET_LATEST_FAIL,
  }
}

export const threadsGetLatest = (cluster, lastTimestamp, now) => {
  console.log({'table_id':'threads', 'from': lastTimestamp, 'to': now})
  return dispatch => {
    dispatch(threadsGetLatestStart())
    axios.post("http://127.0.0.1:8000/api/",{'table_id':'threads', 'cluster': cluster, 'filters':{'from':lastTimestamp,'to':now}})
      .then(response => {
        let [transformedData, maxTs] = transformData(response.data)
        dispatch(threadsAddLatest(transformedData, maxTs))
      })
      .catch(error => {
        dispatch(threadsGetLatestFail(error))
      })
  }
}
