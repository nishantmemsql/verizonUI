import { batch } from "react-redux";
import axios from "axios";

import * as actionTypes from "./actionTypes";
import memoryBreakdown from "../../data/memory_breakdown_2";
import cpuUsage from "../../data/cpu_usage";
import diskUsage from "../../data/disk_usage";
import memoryUsage from "../../data/memory_usage";
import diskLatency from "../../data/disk_latency";

import * as colorActions from "./colorActions";

export const fetchAll = (cluster, from, to) => {
  return dispatch => {
    batch(() => {
      dispatch(memoryBreakDownFetch(cluster, from, to));
      dispatch(cpuUsageFetch(cluster, from, to));
      dispatch(diskUsageFetch(cluster, from, to));
      dispatch(memoryUsageFetch(cluster, from, to));
      dispatch(cpuRunQFetch(cluster, from, to));
    });
  };
};

const dateParser = date => {
  let time = date.replace("T", " ").replace("Z", "");
  return time;
};

const transformData = (data, structure) => {
  let options = {};
  for (let entry of data) {
    const host = entry.node || entry.host || entry.hostname;
    for (let type of Object.keys(structure.data)) {
      options[type] = true;
      if (!structure.data[type][host]) {
        structure.data[type][host] = [];
      }

      let formattedTs = dateParser(entry.timestamp || entry.snapshot_time);
      structure.data[type][host].push({
        x: formattedTs,
        y: entry[type],
      });
    }
  }
  structure.loading = false;
  structure.error = null;
  structure.options = Object.keys(options).sort();
  structure.original = data;
  return structure;
};

/* MEMORY BREAKDOWN */

export const memoryBreakDownFetch = (cluster, from, to) => {
  /*
  let memory_breakdown_structure = {
    active: "memory_usage",
    data: {
      memory_usage: {},
      query: {},
      background: {},
      segment: {},
      cache: {},
      malloc: {},
    },
    options: [],
  };
  */
  let memory_breakdown_structure = {
    active: "allocated_memory_gb",
    data: {
      allocated_memory_gb: {},
      query_memory_gb: {},
      background_memory_gb: {},
      segment_memory_gb: {},
      cached_memory_gb: {},
      malloc_memory_gb: {},
    },
    options: [],
  };
  return dispatch => {
    dispatch(memoryBreakDownFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "memoryBreakdown",
        filters: { from: from, to: to },
      })
      .then(response => {
        console.log("memory breakdown: ",response.data)
        let transformedData = null;
        if (response.data.status === "failed") {
          transformedData = transformData(
            memoryBreakdown.memory_breakdown,
            memory_breakdown_structure
          );
        } else {
          transformedData = transformData(
            response.data.data,
            memory_breakdown_structure
          );
        }

        dispatch(memoryBreakDownFetchSuccess(transformedData));
        //dispatch()
        const sortedNodes = Object.keys(
          transformedData.data[Object.keys(transformedData.data)[0]]
        ).sort();
        dispatch(colorActions.addHostColor(sortedNodes));
        
      })
      .catch(error => {
        dispatch(memoryBreakDownFetchFail(error.response));
        let transformedData = transformData(
          memoryBreakdown.memory_breakdown,
          memory_breakdown_structure
        );
        dispatch(memoryBreakDownFetchSuccess(transformedData));
        /*const sortedNodes = Object.keys(
          transformedData.data[Object.keys(transformedData.data)[0]]
        ).sort();
        dispatch(colorActions.addNodeColor(sortedNodes));
        */
      });
  };
};

const memoryBreakDownFetchStart = () => {
  return { type: actionTypes.MEMORY_BREAKDOWN_FETCH_START };
};

const memoryBreakDownFetchSuccess = data => {
  return { type: actionTypes.MEMORY_BREAKDOWN_FETCH_SUCCESS, data: data };
};

const memoryBreakDownFetchFail = error => {
  return { type: actionTypes.MEMORY_BREAKDOWN_FETCH_FAIL, error: error };
};

export const changeActiveMemoryBreakdown = newValue => {
  return {
    type: actionTypes.CHANGE_ACTIVE_MEMORY_BREAKDOWN,
    newValue: newValue,
  };
};

/* CPU USAGE */

export const cpuUsageFetch = (cluster, from, to) => {
  const cpu_usage_structure = {
    active: "cpuusr",
    data: {
      cpuusr: {},
      cpunice: {},
      cpusys: {},
      cpuiowait: {},
      cpusteal: {},
      cpuidle: {},
    },
    options: [],
  };
  return dispatch => {
    dispatch(cpuUsageFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "cpu",
        cluster: cluster,
        filters: { from: from, to: to },
      })
      .then(response => {
        console.log("cpu usage: ", response.data)
        let transformedData = null;
        if (response.data.status === "failed") {
          transformedData = transformData(
            cpuUsage.cpu_usage,
            cpu_usage_structure
          );
        } else {
          transformedData = transformData(
            response.data.data,
            cpu_usage_structure
          );
        }
        dispatch(cpuUsageFetchSuccess(transformedData));
        const sortedNodes = Object.keys(
          transformedData.data[Object.keys(transformedData.data)[0]]
        ).sort();
        dispatch(colorActions.addHostColor(sortedNodes));
      })
      .catch(error => {
        dispatch(cpuUsageFetchFail(error.response));
        let transformedData = transformData(
          cpuUsage.cpu_usage,
          cpu_usage_structure
        );
        dispatch(cpuUsageFetchSuccess(transformedData));
        const sortedNodes = Object.keys(
          transformedData.data[Object.keys(transformedData.data)[0]]
        ).sort();
        dispatch(colorActions.addHostColor(sortedNodes));
        
      });
  };
};

const cpuUsageFetchStart = () => {
  return { type: actionTypes.CPU_USAGE_FETCH_START };
};

const cpuUsageFetchSuccess = data => {
  return { type: actionTypes.CPU_USAGE_FETCH_SUCCESS, data: data };
};

const cpuUsageFetchFail = error => {
  return { type: actionTypes.CPU_USAGE_FETCH_FAIL, error: error };
};

export const changeActiveCpu = newValue => {
  return {
    type: actionTypes.CHANGE_ACTIVE_CPU_USAGE,
    newValue: newValue,
  };
};

/* DISK USAGE */

export const diskUsageFetch = (cluster, from, to) => {
  const disk_latency_structure = {
    active: "reads_per_sec",
    data: {
      rrqms : {},
      wrqms : {},
      reads_per_sec : {},
      writes_per_sec : {},
      read_mbps : {},
      write_mbps : {},
      avgrqsz : {},
      avgqusz : {},
      average_wait_time_ms : {},
      read_average_wait_time_ms : {},
      write_average_wait_time_ms : {},
      disk_service_time_ms : {},
      percent_util : {}
    },
    options: [],
  }
  const disk_usage_structure = {
    active: "reads_per_sec",
    data: {
      rrqms: {},
      wrqms: {},
      reads_per_sec: {},
      writes_per_sec: {},
      read_mbps: {},
      write_mbps: {},
      avgrqsz: {},
      avgqusz: {},
      average_wait_time_ms: {},
      read_average_wait_time_ms: {},
      write_average_wait_time_ms: {},
      svcdisk_service_time_ms: {},
      percent_util: {},
    },
    options: [],
  };
  return dispatch => {
    dispatch(diskUsageFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "disk",
        cluster: cluster,
        filters: { from: from, to: to },
      })
      .then(response => {
        let transformedData = null;
        if (response.data.status === "failed") {
          transformedData = transformData(
            diskUsage.disk_usage,
            disk_usage_structure
          );
        } else {
          transformedData = transformData(
            response.data.data,
            disk_usage_structure
          );
        }
        dispatch(diskUsageFetchSuccess(transformedData));
        const sortedNodes = Object.keys(
          transformedData.data[Object.keys(transformedData.data)[0]]
        ).sort();
        dispatch(colorActions.addHostColor(sortedNodes));
      })
      .catch(error => {
        dispatch(diskUsageFetchFail(error.response));
        let transformedData = transformData(
          diskLatency.disk_latency,
          disk_latency_structure
          //diskUsage.disk_usage,
          //disk_usage_structure
        );
        dispatch(diskUsageFetchSuccess(transformedData));
        const sortedNodes = Object.keys(
          transformedData.data[Object.keys(transformedData.data)[0]]
        ).sort();
        dispatch(colorActions.addHostColor(sortedNodes));
        
      });
  };
};

const diskUsageFetchStart = () => {
  return { type: actionTypes.DISK_USAGE_FETCH_START };
};

const diskUsageFetchSuccess = data => {
  return { type: actionTypes.DISK_USAGE_FETCH_SUCCESS, data: data };
};

const diskUsageFetchFail = error => {
  return { type: actionTypes.DISK_USAGE_FETCH_FAIL, error: error };
};

export const changeActiveDisk = newValue => {
  return {
    type: actionTypes.CHANGE_ACTIVE_DISK_USAGE,
    newValue: newValue,
  };
};

/* MEMORY USAGE */

export const memoryUsageFetch = (cluster, from, to) => {
  const memory_usage_structure = {
    active: "kbmemused",
    data: {
      kbmemfree: {},
      kbmemused: {},
      percent_memused: {},
      kbbuffers: {},
      kbcached: {},
      kbcommit: {},
      percent_commit: {},
      kbactive: {},
      kbinact: {},
      kbdirty: {},
    },
    options: [],
  };
  return dispatch => {
    dispatch(memoryUsageFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "memoryUsage",
        cluster: cluster,
        filters: { from: from, to: to },
      })
      .then(response => {
        let transformedData = null;
        if (response.data.status === "failed") {
          transformedData = transformData(
            memoryUsage.memory_usage,
            memory_usage_structure
          );
        } else {
          transformedData = transformData(
            response.data.data,
            memory_usage_structure
          );
        }
        dispatch(memoryUsageFetchSuccess(transformedData));
        const sortedNodes = Object.keys(
          transformedData.data[Object.keys(transformedData.data)[0]]
        ).sort();
        dispatch(colorActions.addHostColor(sortedNodes));
      })
      .catch(error => {
        dispatch(memoryUsageFetchFail(error.response));
        let transformedData = transformData(
          memoryUsage.memory_usage,
          memory_usage_structure
        );
        dispatch(memoryUsageFetchSuccess(transformedData));
        /*const sortedNodes = Object.keys(
          transformedData.data[Object.keys(transformedData.data)[0]]
        ).sort();
        dispatch(colorActions.addHostColor(sortedNodes));
        */
      });
  };
};

const memoryUsageFetchStart = () => {
  return { type: actionTypes.MEMORY_USAGE_FETCH_START };
};

const memoryUsageFetchSuccess = data => {
  return { type: actionTypes.MEMORY_USAGE_FETCH_SUCCESS, data: data };
};

const memoryUsageFetchFail = error => {
  return { type: actionTypes.MEMORY_USAGE_FETCH_FAIL, error: error };
};

export const changeActiveMemoryUsage = newValue => {
  return {
    type: actionTypes.CHANGE_ACTIVE_MEMORY_USAGE,
    newValue: newValue,
  };
};

// CPU RUNQ

export const cpuRunQFetch = (cluster, from, to) => {
  const runq_structure = {
    active: "ldavg_1",
    data: {
      runq_sz: {},
      plist_sz: {},
      ldavg_1: {},
      ldavg_5: {},
      ldavg_15: {},
      blocked: {},
    },
    options: [],
  };

  return dispatch => {
    dispatch(cpuRunQFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "cpu_runq",
        cluster: cluster,
        filters: { from: from, to: to },
      })
      .then(response => {
        let transformedData = null;
        transformedData = transformData(
          response.data.data,
          runq_structure
        );
        dispatch(cpuRunQFetchSuccess(transformedData));
        const sortedNodes = Object.keys(
          transformedData.data[Object.keys(transformedData.data)[0]]
        ).sort();
        dispatch(colorActions.addHostColor(sortedNodes));
      })
      .catch(error => {
        dispatch(cpuRunQFetchFail(error.response));
        /*
        let transformedData = transformData(
          null,
          runq_structure
        );
        dispatch(cpuRunQFetchSuccess(transformedData));
        */
      });
  };
};

const cpuRunQFetchStart = () => {
  return { type: actionTypes.CPU_RUNQ_FETCH_START };
};

const cpuRunQFetchSuccess = data => {
  return { type: actionTypes.CPU_RUNQ_FETCH_SUCCESS, data: data };
};

const cpuRunQFetchFail = error => {
  return { type: actionTypes.CPU_USAGE_FETCH_FAIL, error: error };
};

export const changeActiveCpuRunQ = newValue => {
  return {
    type: actionTypes.CHANGE_ACTIVE_CPU_RUNQ,
    newValue: newValue,
  };
};