import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { Grid, Card } from "tabler-react";
import UberChart from "../Chart/UberChart";
import SystemChartsHeader from "./SystemChartsHeader/SystemChartsHeader";
import Spinner from "../UI/Spinner/Spinner";

import * as chartActions from "../../redux/actions/chartActions";
import * as threadChartActions from "../../redux/actions/threadActions";

import {
  hostColorSelector,
  nodeColorSelector,
} from "../../redux/reducers/colors";

import { getTimeWindow, convertTimestamp } from "../../helpers";
import { getCluster } from "../../redux/selectors";

const SystemCharts = props => {
  const [before, now] = getTimeWindow();

  let [cpuUsageStart, setCpuUsageStart] = useState(before);
  let [cpuUsageEnd, setCpuUsageEnd] = useState(now);

  let [diskUsageStart, setDiskUsageStart] = useState(before);
  let [diskUsageEnd, setDiskUsageEnd] = useState(now);

  let [memoryUsageStart, setMemoryUsageStart] = useState(before);
  let [memoryUsageEnd, setMemoryUsageEnd] = useState(now);

  let [memoryBreakdownStart, setMemoryBreakdownStart] = useState(before);
  let [memoryBreakdownEnd, setMemoryBreakdownEnd] = useState(now);

  useEffect(() => {
    //const [from, now] = getTimeWindow().map(ts => convertTimestamp(ts));

    //console.log("SELECTED: ", from, now);
    props.fetchAll(props.cluster, props.fromTs, props.toTs);
    props.threadsData ||
      props.fetchThreads(props.cluster, props.fromTs, props.toTs);
  }, []);

  return (
    <React.Fragment>
      <Grid.Col sm={6}>
        <Card>
          <SystemChartsHeader
            title={"CPU Usage"}
            options={props.cpuOptions}
            active={props.activeCpu}
            change={props.changeActiveCpu}
            dateStart={cpuUsageStart}
            setDateStart={setCpuUsageStart}
            dateEnd={cpuUsageEnd}
            setDateEnd={setCpuUsageEnd}
          />
          {props.cpuUsageLoading ? (
            <Spinner />
          ) : (
            <UberChart
              actualData={
                props.cpuUsage && props.activeCpu
                  ? props.cpuUsage[props.activeCpu]
                  : null
              }
              colors={props.hostColors}
            />
          )}
        </Card>
      </Grid.Col>

      <Grid.Col sm={6}>
        <Card>
          <SystemChartsHeader
            title={"Disk Usage"}
            options={props.diskOptions}
            active={props.activeDisk}
            change={props.changeActiveDisk}
            dateStart={diskUsageStart}
            setDateStart={setDiskUsageStart}
            dateEnd={diskUsageEnd}
            setDateEnd={setDiskUsageEnd}
          />
          {props.diskUsageLoading ? (
            <Spinner />
          ) : (
            <UberChart
              actualData={
                props.diskUsage && props.activeDisk
                  ? props.diskUsage[props.activeDisk]
                  : null
              }
              colors={props.hostColors}
            />
          )}
        </Card>
      </Grid.Col>

      <Grid.Col sm={6}>
        <Card>
          <SystemChartsHeader
            title={"Memory Usage"}
            options={props.memoryUsageOptions}
            active={props.activeMemoryUsage}
            change={props.changeActiveMemoryUsage}
            dateStart={memoryUsageStart}
            setDateStart={setMemoryUsageStart}
            dateEnd={memoryUsageEnd}
            setDateEnd={setMemoryUsageEnd}
          />
          {props.memoryUsageLoading ? (
            <Spinner />
          ) : (
            <UberChart
              actualData={
                props.memoryUsage && props.activeMemoryUsage
                  ? props.memoryUsage[props.activeMemoryUsage]
                  : null
              }
              colors={props.hostColors}
            />
          )}
        </Card>
      </Grid.Col>
      
      <Grid.Col sm={6}>
        <Card>
          <SystemChartsHeader
            title={"CPU RunQ"}
            options={props.cpuRunQOptions}
            active={props.activeCpuRunQ}
            change={props.changeActiveCpuRunQ}
            dateStart={null}
            setDateStart={null}
            dateEnd={null}
            setDateEnd={null}
          />
          {props.cpuRunQLoading ? (
            <Spinner />
          ) : (
            <UberChart
              actualData={
                props.cpuRunQ && props.activeCpuRunQ
                  ? props.cpuRunQ[props.activeCpuRunQ]
                  : null
              }
              colors={props.nodeColors}
            />
          )}
        </Card>
      </Grid.Col>
      
      {/*
      <Grid.Col sm={6}>
        <Card>
        title={"Memory Breakdown"}
            options={props.memoryBreakdownOptions}
        <SystemChartsHeader
            active={props.activeMemoryBreakdown}
            change={props.changeActiveMemoryBreakdown}
            dateStart={memoryBreakdownStart}
            setDateStart={setMemoryBreakdownStart}
            dateEnd={memoryBreakdownEnd}
            setDateEnd={setMemoryBreakdownEnd}
          />
          {props.memoryBreakdownLoading ? (
            <Spinner />
          ) : (
            <UberChart
              actualData={
                props.memoryBreakdown && props.activeMemoryBreakdown
                  ? props.memoryBreakdown[props.activeMemoryBreakdown]
                  : null
              }
              colors={props.nodeColors}
            />
          )}
        </Card>
      
      </Grid.Col>
      */}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    hostColors: hostColorSelector(state),
    nodeColors: nodeColorSelector(state),
    memoryBreakdown: state.charts.memory_breakdown.data,
    memoryBreakdownLoading: state.charts.memory_breakdown.loading,
    memoryBreakdownOptions: state.charts.memory_breakdown.options,
    activeMemoryBreakdown: state.charts.memory_breakdown.data
      ? state.charts.memory_breakdown.active
      : [],

    cpuUsage: state.charts.cpu_usage.data,
    cpuUsageLoading: state.charts.cpu_usage.loading,
    cpuOptions: state.charts.cpu_usage.options,
    activeCpu: state.charts.cpu_usage.data ? state.charts.cpu_usage.active : [],

    diskUsage: state.charts.disk_usage.data,
    diskUsageLoading: state.charts.disk_usage.loading,
    diskOptions: state.charts.disk_usage.options,
    activeDisk: state.charts.disk_usage.data
      ? state.charts.disk_usage.active
      : [],

    memoryUsage: state.charts.memory_usage.data,
    memoryUsageLoading: state.charts.memory_usage.loading,
    memoryUsageOptions: state.charts.memory_usage.options,
    activeMemoryUsage: state.charts.memory_usage.data
      ? state.charts.memory_usage.active
      : [],

    cpuRunQ: state.charts.cpu_runq.data,
    cpuRunQLoading: state.charts.cpu_runq.loading,
    cpuRunQOptions: state.charts.cpu_runq.options,
    activeCpuRunQ: state.charts.cpu_runq.data
      ? state.charts.cpu_runq.active
      : [],

    threadsData: state.threads.data,
    threadsLoading: state.threads.loading,
    cluster: getCluster(state),
    fromTs: state.filters.fromTs,
    toTs: state.filters.toTs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //fetchMemory: () => dispatch(chartActions.memoryBreakDownFetch()),
    changeActiveMemoryBreakdown: value =>
      dispatch(chartActions.changeActiveMemoryBreakdown(value)),

    //fetchCpuUsage: () => dispatch(chartActions.cpuUsageFetch()),
    changeActiveCpu: value => dispatch(chartActions.changeActiveCpu(value)),

    changeActiveDisk: value => dispatch(chartActions.changeActiveDisk(value)),

    changeActiveMemoryUsage: value =>
      dispatch(chartActions.changeActiveMemoryUsage(value)),

    changeActiveCpuRunQ: value => dispatch(chartActions.changeActiveCpuRunQ(value)),

    fetchAll: (cluster, from, to) =>
      dispatch(chartActions.fetchAll(cluster, from, to)),

    fetchThreads: (cluster, from, to) =>
      dispatch(threadChartActions.threadsFetch(cluster, from, to)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemCharts);
