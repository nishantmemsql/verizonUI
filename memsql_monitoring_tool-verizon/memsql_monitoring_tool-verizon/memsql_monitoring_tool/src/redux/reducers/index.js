import { combineReducers } from "redux";
import filters from "./filters";
import charts from "./charts";
import sizes from "./sizes";
import tableData from "./tableData";
import threads from "./threads";
import colors from "./colors";
import processes from "./processes";
import benchmark from "./benchmark";
import ash from "./ash";

const combinedReducers = {
  filters: filters,
  charts: charts,
  sizes: sizes,
  tableData: tableData,
  threads: threads,
  colors: colors,
  processes: processes,
  benchmark: benchmark,
  ash: ash,
};

export default combineReducers(combinedReducers);
