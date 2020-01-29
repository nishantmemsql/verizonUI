import * as actionTypes from "./actionTypes";
import axios from "axios";

import sizesData from "../../data/database_sizes";

function transformData(data) {
  //return new Promise((resolve, reject) => {
  //  setTimeout(() => {
  let transformedData = {
    data: {
      rowstore_in_gb: {},
      comp_columnstore_in_gb: {},
      uncomp_columnstore_in_gb: {},
    },
    activeTypes: ["rowstore_in_gb"],
    activeDBs: [],
  };

  let databases = {};

  for (let entry of data) {
    let database = entry.database_name;
    databases[database] = null;
    if (!transformData.activeDB) {
      transformedData.activeDBs = [database];
    }
    //if(!transformedData[database]) {
    //  transformedData[database] = {...sizeStructure}
    //}
    for (let type of Object.keys(transformedData.data)) {
      if (!transformedData.data[type][database]) {
        transformedData.data[type][database] = { x: [], y: [] };
      }
      transformedData.data[type][database].x.push(entry.timestamp);
      transformedData.data[type][database].y.push(entry[type]);
    }
  }
  transformedData.databases = Object.keys(databases);
  //  resolve(transformedData)
  //}, 0)
  return transformedData;
  //})
}

const sizesFetchStart = () => {
  return {
    type: actionTypes.SIZES_FETCH_START,
  };
};

const sizesFetchSuccess = data => {
  return {
    type: actionTypes.SIZES_FETCH_SUCCESS,
    data: data,
  };
};

const sizesFetchFail = error => {
  return {
    type: actionTypes.SIZES_FETCH_FAIL,
  };
};

export const sizesFetch = () => {
  console.log({ table_id: "dbsizes", cluster: "ktymsqlitc11" });
  return dispatch => {
    dispatch(sizesFetchStart());
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "dbsizes",
        cluster: "ktymsqlitc11",
      })
      .then(response => {
        let transformedData = transformData(response.data.data);
        dispatch(sizesFetchSuccess(transformedData));
      })
      .catch(error => {
        dispatch(sizesFetchFail());
        let transformedData = transformData(sizesData.database_sizes);
        dispatch(sizesFetchSuccess(transformedData));
      });

    //transformData(sizesData.database_sizes)
    //  .then(response => {

    //  })
    //  .catch(error => {
    //    dispatch(sizesFetchFail(error.response))
    //  })
  };
};

export const changeSelectedDatabases = newSelection => {
  return {
    type: actionTypes.CHANGE_SELECTED_DATABASES,
    newSelection: newSelection,
  };
};

export const changeSelectedTypes = newSelection => {
  return {
    type: actionTypes.CHANGE_SELECTED_TYPES,
    newSelection: newSelection,
  };
};
