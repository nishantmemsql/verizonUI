// @flow

import React, { useEffect, useState } from "react";

import { Page, Grid, Card } from "tabler-react";
import Picky from "react-picky";

import SiteWrapper from "../SiteWrapper";
import Spinner from "../components/UI/Spinner/Spinner";
import DatePicker from "react-datepicker";
import UberChart from "../components/Chart/UberChart";
import * as threadChartActions from "../redux/actions/threadActions";
import * as processChartActions from "../redux/actions/processActions";
import * as benchmarkChartActions from "../redux/actions/benchmarkActions";
import { connect } from "react-redux";
import { Refresh, ArrowRight } from "@material-ui/icons";

import { getTimeWindow, convertTimestamp } from "../helpers";

import classes from "./Threads.module.css";
import ClusterSelect from "../components/ClusterSelect";
import { getCluster } from "../redux/selectors";

function Threads(props) {
  const [before, now] = getTimeWindow();

  let [startDate, setStartDate] = useState(before);
  let [endDate, setEndDate] = useState(now);

  // FIXME: gecironda kód...

  const fetchCharts = () => {
    const convertedStart = convertTimestamp(startDate);
    const convertedEnd = convertTimestamp(endDate);
    props.fetchThreads(props.cluster, convertedStart, convertedEnd);
    props.fetchProcesses(props.cluster, convertedStart, convertedEnd);
    props.fetchBenchmark(props.cluster, convertedStart, convertedEnd);
  };

  const refreshCharts = () => {
    const now = new Date();
    const convertedTs = convertTimestamp(now);
    props.fetchLatestThreads(props.cluster, props.threadsMaxTs, convertedTs);
    props.fetchLatestProcesses(
      props.cluster,
      props.processesMaxTs,
      convertedTs
    );
    setEndDate(now);
  };

  useEffect(() => {
    const convertedStart = convertTimestamp(startDate);
    const convertedEnd = convertTimestamp(endDate);
    //if (!props.threadsData) {
    props.fetchThreads(props.cluster, convertedStart, convertedEnd);
    //}
    //if (!props.processesData) {
    props.fetchProcesses(props.cluster, convertedStart, convertedEnd);
    //}
    //if (!props.benchmarkData) {
    props.fetchBenchmark(props.cluster, convertedStart, convertedEnd);
    //}
  }, [props.cluster]);

  let plottedThreadData = null;
  if (props.threadsData && props.shownThreadData) {
    plottedThreadData = {};
    props.shownThreadData.map(host => {
      plottedThreadData[host] = props.threadsData[host];
    });
  }

  let plottedProcessData = null;
  if (props.processesData && props.shownProcessData) {
    plottedProcessData = {};
    props.shownProcessData.map(host => {
      plottedProcessData[host] = props.processesData[host];
    });
  }
  return (
    <SiteWrapper>
      <Page.Content title="Threads">
        <Grid.Row>
          <Grid.Col sm={6}>
            <ClusterSelect />
          </Grid.Col>
          <Grid.Col sm={6}>
            <div style={{ display: "flex" }}>
              <h4 className={classes.fromto}>From:</h4>
              <DatePicker
                className={classes.DatePicker}
                selected={startDate}
                onChange={value => setStartDate(value)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MM.d HH:mm"
              />
              <h4 className={classes.fromto}>To:</h4>
              <DatePicker
                className={classes.DatePicker}
                selected={endDate}
                onChange={value => setEndDate(value)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MM.d HH:mm"
                popperModifiers={{
                  preventOverflow: {
                    enabled: true,
                    escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                    boundariesElement: "viewport",
                  },
                }}
              />
              <ArrowRight cursor="pointer" onClick={() => fetchCharts()} />
              <Refresh cursor="pointer" onClick={() => refreshCharts()} />
            </div>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col sm={6}>
            {props.cluster ? (
              <Card>
                <Card.Header>
                  <Card.Title>Thread counts</Card.Title>
                  <div style={{ width: "200px", margin: "0px 10px 0px 10px" }}>
                    <Picky
                      id="threadpicky"
                      options={
                        props.threadsData ? Object.keys(props.threadsData) : []
                      }
                      value={props.shownThreadData}
                      onChange={value => props.changeActiveThreads(value)}
                      dropdownHeight={400}
                      keepOpen={false}
                      multiple={true}
                      includeSelectAll={true}
                    />
                  </div>
                </Card.Header>
                {props.threadsLoading ? (
                  <Spinner />
                ) : (
                  <UberChart
                    actualData={plottedThreadData}
                    height={480}
                    width={900}
                    colors={props.colors}
                  />
                )}
                {/*<Chart actualData={
                  props.cpuUsage && props.activeCpu
                  ? props.cpuUsage[props.activeCpu]
                  : null}
                />*/}
              </Card>
            ) : null}
          </Grid.Col>

          <Grid.Col sm={6}>
            {props.cluster ? (
              <Card>
                <Card.Header>
                  <Card.Title>Process counts</Card.Title>
                  <div style={{ width: "200px", margin: "0px 10px 0px 10px" }}>
                    <Picky
                      id="processpicky"
                      options={
                        props.processesData
                          ? Object.keys(props.processesData)
                          : []
                      }
                      value={props.shownProcessData}
                      onChange={value => props.changeActiveProcesses(value)}
                      dropdownHeight={400}
                      keepOpen={false}
                      multiple={true}
                      includeSelectAll={true}
                    />
                  </div>
                </Card.Header>
                {props.processesLoading ? (
                  <Spinner />
                ) : (
                  <UberChart
                    actualData={plottedProcessData}
                    height={480}
                    width={900}
                    colors={props.colors}
                  />
                )}
                {/*<Chart actualData={
                    props.cpuUsage && props.activeCpu
                    ? props.cpuUsage[props.activeCpu]
                    : null}
                  />*/}
              </Card>
            ) : null}
          </Grid.Col>
        </Grid.Row>

        <Grid.Row>
          <Grid.Col sm={6}>
            {props.cluster ? (
              <Card>
                <Card.Header>
                  <Card.Title>Benchmark query results</Card.Title>
                </Card.Header>
                {props.benchmarkLoading ? (
                  <Spinner />
                ) : (
                  <UberChart
                    actualData={props.benchmarkData}
                    height={480}
                    width={900}
                    colors={props.colors}
                  />
                )}
                {/*<Chart actualData={
                  props.cpuUsage && props.activeCpu
                  ? props.cpuUsage[props.activeCpu]
                  : null}
                />*/}
              </Card>
            ) : null}
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  );
}

const mapStateToProps = state => {
  return {
    threadsData: state.threads.data,
    processesData: state.processes.data,

    threadsLoading: state.threads.loading,
    processesLoading: state.processes.loading,

    shownThreadData: state.threads.active,
    shownProcessData: state.processes.active,

    colors: Object.keys(state.colors.nodes),
    threadsMaxTs: state.threads.maxTs,
    processesMaxTs: state.processes.maxTs,

    cluster: localStorage.getItem("cluster"), //getCluster(state),

    benchmarkData: state.benchmark.data,
    benchmarkLoading: state.benchmark.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchThreads: (cluster, from, to) =>
      dispatch(threadChartActions.threadsFetch(cluster, from, to)),
    fetchProcesses: (cluster, from, to) =>
      dispatch(processChartActions.processesFetch(cluster, from, to)),
    changeActiveThreads: newActiveThreads =>
      dispatch(threadChartActions.threadsChangeActive(newActiveThreads)),
    changeActiveProcesses: newActiveProcesses =>
      dispatch(processChartActions.processesChangeActive(newActiveProcesses)),
    fetchLatestThreads: (cluster, from, to) =>
      dispatch(threadChartActions.threadsGetLatest(cluster, from, to)),
    fetchLatestProcesses: (cluster, from, to) =>
      dispatch(processChartActions.processesGetLatest(cluster, from, to)),
    fetchBenchmark: (cluster, from, to) =>
      dispatch(benchmarkChartActions.benchmarkFetch(cluster, from, to)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Threads);
