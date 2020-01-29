import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { Page, Grid, Card } from "tabler-react";
import SiteWrapper from "../SiteWrapper";
import Filters from "../components/Filters/Filters";
import AreaChart from "../components/Ash/AreaChart/AreaChart";
import Table from "../components/Ash/Table/Table";
import Modal from "../components/UI/Modal/Modal";
import Spinner from "../components/UI/Spinner/Spinner";
import QueryDetail from "../components/Ash/QueryDetail/QueryDetail";

import * as ashActions from "../redux/actions/ashActions";
import * as filterActions from "../redux/actions/filterActions";
import { Refresh, Error, Check, ArrowRightRounded } from "@material-ui/icons";
import MatTable from "@material-ui/core/Table";
import { TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";

const calcSum = arr => {
  return arr.reduce((el1, el2) => el1 + el2, 0);
};

const ClusterStats = props => {
  let [showModal, toggleModal] = useState(false);
  let [queryStat, setQueryStat] = useState(null);
  let [aggsOffline, setAggsOffline] = useState(false);
  let [leavesOffline, setLeavesOffline] = useState(false);
  let [partitionsOffline, setPartitionsOffline] = useState(false);
  let [clusterInfo, setClusterInfo] = useState(null);

  const modalClose = () => {
    toggleModal(false);
    setQueryStat(null);
  };

  const setTimeWindow = (from, to) => {
    props.setFromTs(from);
    props.setToTs(to);
  };

  const fetchByTimestamp = () => {
    props.fetchMemoryBreakdown(
      localStorage.getItem("cluster"),
      props.fromTs,
      props.toTs
    );
  };

  const cellAligns = {
    query_text: "left",
    query: "left",
    plan_info: "center",
    database_name: "left",
    database: "left",
    user: "left",
    state: "left",
    time: "right",
    "avg. time": "right",
    "last run": "right",
    last_run: "left",
    avg_cpu_time_s: "right",
    avg_cpu_wait_time_s: "right",
    avg_elapsed_time_s: "right",
    avg_lock_time_s: "right",
    avg_network_time_s: "right",
    avg_disk_time_s: "right",
    avg_io_mb: "right",
    avg_network_mb: "right",
    avg_memory_mb: "right",
    avg_major_faults: "right",
    total_executions: "right",
    optimizer_notes: "center",
  };

  const transformQueryStatsData = data => {
    let transformedData = [];
    data.map(element => {
      transformedData.push({
        ...element,
        insert_ts: element.insert_ts.replace("T", " ").replace("Z", ""),
        last_run: element.last_run.replace("T", " ").replace("Z", ""),
      });
    });

    return transformedData;
  };

  const drillDownQuery = activityName => {
    toggleModal(true);
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "query_stat",
        cluster: localStorage.getItem("cluster"),
        filters: { activity_name: activityName },
      })
      .then(response => {
        setQueryStat(transformQueryStatsData(response.data.data));
      })
      .catch(error => console.log(error));
  };

  const refreshActiveProcesses = () => {
    props.fetchActiveProcesses(localStorage.getItem("cluster"));
  };

  const getClusterInfo = () => {
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "cluster_global_info",
        cluster: localStorage.getItem("cluster"),
      })
      .then(response => {
        console.log("cluster_info: ", response.data);

        setClusterInfo(response.data.data);
      })
      .catch(error => console.log(error));
  };

  const getCurrentClusterState = () => {
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "aggregator_status",
        cluster: localStorage.getItem("cluster"),
      })
      .then(response => {
        console.log("agg status: ", response.data);
        setAggsOffline(response.data.data);
      })
      .catch(error => console.log(error));
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "leaf_status",
        cluster: localStorage.getItem("cluster"),
      })
      .then(response => {
        console.log("leaf status: ", response.data);
        setLeavesOffline(response.data.data);
      })
      .catch(error => console.log(error));
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "partition_status",
        cluster: localStorage.getItem("cluster"),
      })
      .then(response => {
        console.log("partition status: ", response.data);
        setPartitionsOffline(response.data.data);
      })
      .catch(error => console.log(error));
    axios
      .post("http://127.0.0.1:8000/api/", {
        table_id: "rebalance_partitions",
        cluster: localStorage.getItem("cluster"),
      })
      .then(response => {
        console.log("rebalance needed: ", response.data);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    getClusterInfo();
    getCurrentClusterState();
    props.fetchMemoryBreakdown(
      localStorage.getItem("cluster"),
      props.fromTs,
      props.toTs
    );
    props.fetchActiveProcesses(localStorage.getItem("cluster"));
    props.fetchClusterStats(localStorage.getItem("cluster"));
  }, [props.cluster]);

  let data = {};
  let series = [];
  if (props.memoryBreakdownData && props.timestamps && props.memoryTypes) {
    props.memoryTypes.map(t => (data[t] = []));
    props.timestamps.map((ts, tsIdx) => {
      let tmpData = [];
      props.memoryTypes.map(t => {
        data[t].push({
          x: tsIdx,
          y: calcSum(props.memoryBreakdownData[ts].leaf[t]),
        });
      });
    });
    props.memoryTypes.map(t => {
      series.push({
        title: t,
        disabled: false,
        data: data[t],
      });
    });
  }

  return (
    <React.Fragment>
      <SiteWrapper>
        <Page.Content>
        
        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
            <Filters onRun={fetchByTimestamp}/>
          </Grid >
            <Grid.Row sm={12} cards={true}>
              <Grid.Col width={6} sm={4} lg={3}>
                <Card>
                  <Card.Header>
                    <Card.Title>Aggregator status</Card.Title>
                    {aggsOffline ? <Error /> : <Check />}
                  </Card.Header>
                </Card>
              </Grid.Col>
              <Grid.Col width={6} sm={4} lg={3}>
                <Card>
                  <Card.Header>
                    <Card.Title>Leaf status</Card.Title>
                    {leavesOffline ? <Error /> : <Check />}
                  </Card.Header>
                </Card>
              </Grid.Col>
              <Grid.Col width={6} sm={4} lg={3}>
                <Card>
                  <Card.Header>
                    <Card.Title>Partition status</Card.Title>
                    {partitionsOffline ? <Error /> : <Check />}
                  </Card.Header>
                </Card>
              </Grid.Col>
              <Grid.Col width={6} sm={4} lg={3}>
                <Card>
                  <Card.Header>
                    <Card.Title>Rebalance partitions</Card.Title>
                    {partitionsOffline ? <Error /> : <Check />}
                  </Card.Header>
                </Card>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col sm={12}>
                <Card>
                  <Card.Header>
                    <Card.Title>Cluster specifications</Card.Title>
                  </Card.Header>
                  {clusterInfo ? (
                    <MatTable>
                      <TableHead>
                        <TableRow key="variables">
                          {clusterInfo.map(el => (
                            <TableCell>{el.variable}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow key="values">
                          {clusterInfo.map(el => (
                            <TableCell>{el.value}</TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </MatTable>
                  ) : null}
                </Card>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col sm={6}>
                <Card>
                  <Card.Header>
                    <Card.Title>Total Leaf Memory Allocation</Card.Title>
                  </Card.Header>
                  {props.memoryBreakdownLoading ? (
                    <Spinner />
                  ) : (
                    <AreaChart
                      data={data}
                      categories={props.memoryTypes}
                      series={series}
                      xLabels={props.timestamps}
                      setTimeWindow={setTimeWindow}
                    />
                  )}
                </Card>
              </Grid.Col>
              <Grid.Col sm={6}>
                <Card>
                  <Card.Header>
                    <Card.Title>Active Processess</Card.Title>
                    <Refresh
                      style={{ cursor: "pointer" }}
                      onClick={refreshActiveProcesses}
                    />
                  </Card.Header>
                  {props.activeProcesses.data ? (
                    <Table
                      header={[
                        "query",
                        "server",
                        "port",
                        "database",
                        "user",
                        "state",
                        "time",
                        "avg. time",
                        "plan_type",
                        "last run",
                      ]}
                      shorten={{ query: true }}
                      copy={{ query: true }}
                      aligns={cellAligns}
                      data={props.activeProcesses.data}
                      clickHandlers={{ query: drillDownQuery }}
                      order={"desc"}
                      orderBy={"time"}
                      type={"tableType"}
                    />
                  ) : props.activeProcessesLoading ? (
                    <Spinner />
                  ) : null}
                </Card>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col sm={6}>
                <Card>
                  <Card.Header>
                    <Card.Title>Cluster Statistics</Card.Title>
                  </Card.Header>
                  {props.clusterStats.data && props.clusterStats.types ? (
                    <Table
                      header={props.clusterStats.types}
                      data={props.clusterStats.data}
                      order={"desc"}
                      orderBy={"TYPE"}
                    />
                  ) : props.clusterStatsLoading ? (
                    <Spinner />
                  ) : null}
                </Card>
              </Grid.Col>
          </Grid.Row>
         
        </Page.Content>
      </SiteWrapper>
      {showModal ? (
        <Modal show={showModal} modalClose={() => modalClose()}>
          <div>
            {queryStat ? <QueryDetail data={queryStat} /> : <Spinner />}
          </div>
        </Modal>
      ) : null}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    memoryBreakdownData: state.ash.memoryBreakdown.data,
    memoryBreakdownLoading: state.ash.memoryBreakdown.loading,
    timestamps: state.ash.memoryBreakdown.timestamps,
    memoryTypes: state.ash.memoryBreakdown.types,
    activeProcesses: state.ash.activeProcesses,
    activeProcessesLoading: state.ash.activeProcesses.loading,
    clusterStats: state.ash.clusterStats,
    clusterStatsLoading: state.ash.clusterStats.loading,
    fromTs: state.filters.fromTs,
    toTs: state.filters.toTs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMemoryBreakdown: (cluster, from, to) =>
      dispatch(ashActions.ashMemoryBreakDownFetch(cluster, from, to)),
    fetchFilteredAshReport: (cluster, from, to) =>
      dispatch(ashActions.ashReportFilteredFetch(cluster, from, to)),
    fetchActiveProcesses: cluster =>
      dispatch(ashActions.processListFetch(cluster)),
    fetchClusterStats: cluster =>
      dispatch(ashActions.clusterStatsFetch(cluster)),
    setFromTs: t => dispatch(filterActions.setFromTs(t)),
    setToTs: t => dispatch(filterActions.setToTs(t)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClusterStats);
