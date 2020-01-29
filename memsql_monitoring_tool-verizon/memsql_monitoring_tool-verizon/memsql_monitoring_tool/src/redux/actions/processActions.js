import  * as actionTypes from './actionTypes';
import * as colorActions from './colorActions';

import axios from 'axios';
import processData from '../../data/process_count';

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
    transformedData[node].push({ x: formattedTs, y: entry.process_count });
    if (formattedTs > maxTs) {
      maxTs = formattedTs
    }
  });
  return [transformedData, maxTs];
}

const processesFetchStart = () => {
  return { type: actionTypes.PROCESS_FETCH_START };
};

const processesFetchSuccess = (data, maxTs) => {
  return { type: actionTypes.PROCESS_FETCH_SUCCESS, data: data, maxTs: maxTs};
};

const processesFetchFail = () => {
  return { type: actionTypes.PROCESS_FETCH_FAIL };
};

export const processesChangeActive = (newActives) => {
  return {type: actionTypes.PROCESS_CHANGE_ACTIVE, newActives: newActives}
}

export const processesFetch = (cluster, from, to) => {
  console.log({'table_id':'processes', "from": from, "to": to})
  return dispatch => {
    dispatch(processesFetchStart());
    axios.post("http://127.0.0.1:8000/api/",{'table_id':'processes', 'cluster': localStorage.getItem("cluster")?localStorage.getItem("cluster"):'ktymsqlitc11', 'filters':{'from':from,'to':to}})
      .then((response => {
        let [transformedData, maxTs] = transformData(response.data.data)
        dispatch(processesFetchSuccess(transformedData, maxTs));
        //const sortedNodes = Object.keys(transformedData).sort()
        //dispatch(colorActions.addNodeColor(sortedNodes))
      }))
      .catch(error => {
        dispatch(processesFetchFail(error.response));
        //let [transformedData, maxTs] = transformData(processData.process_count)
        // failsafe for offline test
        //dispatch(processesFetchSuccess(transformedData, maxTs));
        //const sortedNodes = Object.keys(transformedData).sort()
        //dispatch(colorActions.addNodeColor(sortedNodes));
      })

  };
};

const processesAddLatest = (data, maxTs) => {
  return {
    type: actionTypes.PROCESS_GET_LATEST_SUCCESS,
    data: data,
    maxTs: maxTs,
  }
}

const processesGetLatestStart = (data) => {
  return {
    type: actionTypes.PROCESS_GET_LATEST_START,
    data: data,
  }
}

const processesGetLatestFail = () => {
  return {
    type: actionTypes.PROCESS_GET_LATEST_FAIL,
  }
}

export const processesGetLatest = (cluster, lastTimestamp, now) => {
  console.log({'table_id':'threads', 'from': lastTimestamp, 'to': now})
  return dispatch => {
    dispatch(processesGetLatestStart())
    axios.post("http://127.0.0.1:8000/api/",{'table_id':'processes', 'cluster': cluster, 'filters':{'from':lastTimestamp,'to':now}})
      .then(response => {
        let [transformedData, maxTs] = transformData(response.data)
        dispatch(processesAddLatest(transformedData, maxTs))
      })
      .catch(error => {
        /*let newRandomThreads = newThreads.threads.map(el => {
          return {
            ...el,
            thread_count: Math.random() * 3000,
            ts: "2019-08-27T22:00:20Z",
          }
        })
        let [transformedData, maxTs] = transformData(newRandomThreads)
        */
        dispatch(processesGetLatestFail())
      })
  }
}
