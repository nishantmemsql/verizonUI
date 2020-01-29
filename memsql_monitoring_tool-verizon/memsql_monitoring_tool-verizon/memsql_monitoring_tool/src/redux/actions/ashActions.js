import axios from "axios";
import * as actionTypes from "./actionTypes";

import memoryBreakdown from "../../data/memory_breakdown_2";
import ashReport from "../../data/ash_report";
import activeProcesses from "../../data/active_processes";
import cluster_statistics from "../../data/cluster_statistics";

const dateParser = date => {
  let time = date.replace("T", " ").replace("Z", "");
  return time;
};

const groupByTimestamp = data => {
  let transformed = {};
  let timestamps = {};
  const types = ["segment_memory_gb", "query_memory_gb", 
  "background_memory_gb", "cached_memory_gb", "malloc_memory_gb"];
  data.map(entry => {
    let formattedTs = dateParser(entry.snapshot_time);
    timestamps[formattedTs] = true;
    if (!transformed[formattedTs]) {
      transformed[formattedTs] = {
        leaf: {
          allocated_memory_gb: [],
          maximum_memory_gb: [],
          segment_memory_gb: [],
          query_memory_gb: [],
          background_memory_gb: [],
          cached_memory_gb: [],
          malloc_memory_gb: [],
        },
        agg: {
          allocated_memory_gb: [],
          maximum_memory_gb: [],
          segment_memory_gb: [],
          query_memory_gb: [],
          background_memory_gb: [],
          cached_memory_gb: [],
          malloc_memory_gb: [],
        },
      };
    }
    if (entry.type === "LEAF") {
      transformed[formattedTs].leaf.allocated_memory_gb.push(
        parseFloat(entry.allocated_memory_gb)
      );
      transformed[formattedTs].leaf.maximum_memory_gb.push(
        parseFloat(entry.maximum_memory_gb)
      );
      transformed[formattedTs].leaf.segment_memory_gb.push(parseFloat(entry.segment_memory_gb));
      transformed[formattedTs].leaf.query_memory_gb.push(parseFloat(entry.query_memory_gb));
      transformed[formattedTs].leaf.background_memory_gb.push(
        parseFloat(entry.background_memory_gb)
      );
      transformed[formattedTs].leaf.cached_memory_gb.push(parseFloat(entry.cached_memory_gb));
      transformed[formattedTs].leaf.malloc_memory_gb.push(parseFloat(entry.malloc_memory_gb));
    } else {
      transformed[formattedTs].agg.allocated_memory_gb.push(
        parseFloat(entry.allocated_memory_gb)
      );
      transformed[formattedTs].agg.maximum_memory_gb.push(
        parseFloat(entry.maximum_memory_gb)
      );
      transformed[formattedTs].agg.segment_memory_gb.push(parseFloat(entry.segment_memory_gb));
      transformed[formattedTs].agg.query_memory_gb.push(parseFloat(entry.query_memory_gb));
      transformed[formattedTs].agg.background_memory_gb.push(
        parseFloat(entry.background_memory_gb)
      );
      transformed[formattedTs].agg.cached_memory_gb.push(parseFloat(entry.cached_memory_gb));
      transformed[formattedTs].agg.malloc_memory_gb.push(parseFloat(entry.malloc_memory_gb));
    }
  });
  let sortedTimestamps = Object.keys(timestamps);
  sortedTimestamps.sort();
  return [transformed, sortedTimestamps, types];
};

const transformAshData = data => {
  let transformed = [];
  data.map(element => {
    transformed.push({
      ...element,
      last_run: dateParser(element.last_run),
      avg_cpu_time_s: parseFloat(element.avg_cpu_time_s),
      avg_cpu_wait_time_s: parseFloat(element.avg_cpu_wait_time_s),
      avg_elapsed_time_s: parseFloat(element.avg_elapsed_time_s),
      avg_lock_time_s: parseFloat(element.avg_lock_time_s),
      avg_network_time_s: parseFloat(element.avg_network_time_s),
      avg_disk_time_s: parseFloat(element.avg_disk_time_s),
      avg_io_mb: parseFloat(element.avg_io_mb),
      avg_network_mb: parseFloat(element.avg_network_mb),
      avg_memory_mb: parseFloat(element.avg_memory_mb),
      avg_major_faults: parseFloat(element.avg_major_faults),
      total_executions: parseFloat(element.total_executions),
    });
  });
  return transformed;
};

const transformProcesslistData = data => {
  let transformed = [];
  data.map(element => {
    transformed.push({
      ...element,
      "avg. time": parseFloat(element["avg. time"]),
      "last run": dateParser(element["last run"]),
    });
  });
  return transformed;
};

const ashMemoryBreakDownFetchStart = () => {
  return { type: actionTypes.ASH_MEMORY_BREAKDOWN_GET_LATEST_START };
};

const ashMemoryBreakDownFetchSuccess = (data, timestamps, types) => {
  return {
    type: actionTypes.ASH_MEMORY_BREAKDOWN_GET_LATEST_SUCCESS,
    data: data,
    timestamps: timestamps,
    types: types,
  };
};

const ashMemoryBreakDownFetchFail = error => {
  return {
    type: actionTypes.ASH_MEMORY_BREAKDOWN_GET_LATEST_FAIL,
    data: error,
  };
};

export const ashMemoryBreakDownFetch = (cluster, from, to) => {
  return dispatch => {
    dispatch(ashMemoryBreakDownFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "memoryBreakdown",
        cluster: cluster,
        filters: { from: from, to: to },
      })
      .then(response => {
        console.log("ash memory breakdown:", response.data)
        let transformedData = null
        let timestamps = null
        let types = null
        if(response.data.status === "failed") {
          [transformedData, timestamps, types] = groupByTimestamp(
            memoryBreakdown.memory_breakdown
          );
        } else {
          [transformedData, timestamps, types] = groupByTimestamp(
            response.data.data
          );
        }
        
        dispatch(
          ashMemoryBreakDownFetchSuccess(transformedData, timestamps, types)
        );
        //dispatch()
        /*const sortedNodes = Object.keys(
          transformedData.data[Object.keys(transformedData.data)[0]]
        ).sort();
        dispatch(colorActions.addHostColor(sortedNodes));
        */
      })
      .catch(error => {
        console.log("memory breakdown fetch error:", error)
        dispatch(ashMemoryBreakDownFetchFail(error.response));
        let [transformedData, timestamps, types] = groupByTimestamp(
          memoryBreakdown.memory_breakdown
        );
        dispatch(
          ashMemoryBreakDownFetchSuccess(transformedData, timestamps, types)
        );
        /*const sortedNodes = Object.keys(
          transformedData.data[Object.keys(transformedData.data)[0]]
        ).sort();
        dispatch(colorActions.addNodeColor(sortedNodes));
        */
      });
  };
};

const ashReportFetchStart = () => {
  return { type: actionTypes.ASH_REPORT_FETCH_START };
};

const ashReportFetchSuccess = (data, types) => {
  return {
    type: actionTypes.ASH_REPORT_FETCH_SUCCESS,
    data: data,
    types: types,
  };
};

const ashReportFetchFail = error => {
  return { type: actionTypes.ASH_REPORT_FETCH_FAIL, error: error };
};

export const ashReportFetch = (cluster, from, to) => {
  return dispatch => {
    dispatch(ashReportFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "ash_report_ext",
        cluster: cluster,
        filters: {
          from: from,
          to: to,
        },
      })
      .then(response => {
        const types = [
          "query_text",
          "plan_info",
          "database_name",
          "last_run",
          "avg_cpu_time_s",
          "avg_cpu_wait_time_s",
          "avg_elapsed_time_s",
          "avg_lock_time_s",
          "avg_network_time_s",
          "avg_disk_time_s",
          "avg_io_mb",
          "avg_network_mb",
          "avg_memory_mb",
          "avg_major_faults",
          "total_executions",
          "optimizer_notes",
        ];
        dispatch(
          ashReportFetchSuccess(transformAshData(response.data.data), types)
        );
      })
      .catch(error => {
        const types = [
          "query_text",
          "plan_info",
          "database_name",
          "last_run",
          "avg_cpu_time_s",
          "avg_cpu_wait_time_s",
          "avg_elapsed_time_s",
          "avg_lock_time_s",
          "avg_network_time_s",
          "avg_disk_time_s",
          "avg_io_mb",
          "avg_network_mb",
          "avg_memory_mb",
          "avg_major_faults",
          "total_executions",
          "optimizer_notes",
        ];
        dispatch(ashReportFetchFail(error.response));
        dispatch(
          ashReportFetchSuccess(transformAshData(ashReport.ash_report), types)
        );
      });
  };
};

export const ashReportFilteredFetch = (cluster, from, to) => {
  return dispatch => {
    dispatch(ashReportFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "ash_report_filtered",
        cluster: cluster,
        filters: {
          from: from,
          to: to,
          cluster: cluster,
        },
      })
      .then(response => {
        const types = [
          "query_text",
          "plan_info",
          "database_name",
          "last_run",
          "avg_cpu_time_s",
          "avg_cpu_wait_time_s",
          "avg_elapsed_time_s",
          "avg_lock_time_s",
          "avg_network_time_s",
          "avg_disk_time_s",
          "avg_io_mb",
          "avg_network_mb",
          "avg_memory_mb",
          "avg_major_faults",
          "total_executions",
          "optimizer_notes",
        ];
        dispatch(
          ashReportFetchSuccess(transformAshData(response.data.data), types)
        );
      })
      .catch(error => {
        const types = [
          "query_text",
          "plan_info",
          "database_name",
          "last_run",
          "avg_cpu_time_s",
          "avg_cpu_wait_time_s",
          "avg_elapsed_time_s",
          "avg_lock_time_s",
          "avg_network_time_s",
          "avg_disk_time_s",
          "avg_io_mb",
          "avg_network_mb",
          "avg_memory_mb",
          "avg_major_faults",
          "total_executions",
          "optimizer_notes",
        ];
        dispatch(ashReportFetchFail(error.response));
        dispatch(
          ashReportFetchSuccess(transformAshData(ashReport.ash_report), types)
        );
      });
  };
};

const processListFetchStart = () => {
  return { type: actionTypes.PROCESS_LIST_FETCH_START };
};

const processListFetchSuccess = (data, types) => {
  return {
    type: actionTypes.PROCESS_LIST_FETCH_SUCCESS,
    data: data,
    types: types,
  };
};

const processListFetchFail = error => {
  return { type: actionTypes.PROCESS_LIST_FETCH_FAIL, error: error };
};

export const processListFetch = cluster => {
  return dispatch => {
    dispatch(processListFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "active_processes",
        cluster: cluster,
      })
      .then(response => {
        dispatch(
          processListFetchSuccess(transformProcesslistData(response.data.data))
        );
      })
      .catch(error => {
        dispatch(processListFetchFail(error));
        //dispatch(processListFetchSuccess(transformProcesslistData(activeProcesses.active_processes)))
      });
  };
};

const clusterStatsFetchStart = () => {
  return { type: actionTypes.CLUSTER_STATS_FETCH_START };
};

const clusterStatsFetchSuccess = (data, types) => {
  return {
    type: actionTypes.CLUSTER_STATS_FETCH_SUCCESS,
    data: data,
    types: types,
  };
};

const clusterStatsFetchFail = () => {
  return { type: actionTypes.CLUSTER_STATS_FETCH_FAIL };
};

export const clusterStatsFetch = cluster => {
  return dispatch => {
    dispatch(clusterStatsFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "cluster_statistics",
        cluster: cluster,
      })
      .then(response => {
        console.log("Cluster stats:", response.data)
        const types = [
          "IP_ADDR",
          "PORT",
          "TYPE",
          "VARIABLE_NAME",
          "VARIABLE_VALUE",
        ];
        dispatch(clusterStatsFetchSuccess(response.data.data, types));
      })
      .catch(error => {
        dispatch(clusterStatsFetchFail(error));
        const types = [
          "IP_ADDR",
          "PORT",
          "TYPE",
          "VARIABLE_NAME",
          "VARIABLE_VALUE",
        ];
        //dispatch(clusterStatsFetchSuccess(cluster_statistics.cluster_stats, types))
      });
  };
};
