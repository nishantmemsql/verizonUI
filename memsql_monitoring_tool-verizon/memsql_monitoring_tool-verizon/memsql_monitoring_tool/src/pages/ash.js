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

const Ash = props => {
  let [showModal, toggleModal] = useState(false);
  let [queryStat, setQueryStat] = useState(null);
  let [ashToShow, setAshToShow] = useState(null);

  const modalClose = () => {
    toggleModal(false);
    setQueryStat(null);
  };

  const setTimeWindow = (from, to) => {
    props.setFromTs(from);
    props.setToTs(to);
    //props.fetchAshReport(localStorage.getItem("cluster"), from, to);
    filterAsh(from, to);
  };

  const filterAsh = (from, to) => {
    let filteredAsh = props.ashReport.data.filter(
      el => el.last_run >= from && el.last_run <= to
    );
    setAshToShow(filteredAsh);
  };

  const fetchByTimestamp = () => {
    setAshToShow(null);
    props.fetchFilteredAshReport(
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

  useEffect(() => {
    props.fetchAshReport(
      localStorage.getItem("cluster"),
      props.fromTs,
      props.toTs
    );
  }, [props.cluster]);

  let data = {};
  let series = [];

  // filter the ash report
  if (props.ashReport.data && !ashToShow) {
    setAshToShow(props.ashReport.data);
  }

  return (
    <React.Fragment>
      <SiteWrapper>
        <Page.Content>
          <Grid container alignItems="flex-start" justify="flex-end" direction="row">
            <Filters onRun={fetchByTimestamp}/>
          </Grid >
          <Grid container>
            <Card>
              <Card.Header>
                <Card.Title>ASH report</Card.Title>
              </Card.Header>
              {props.ashReportLoading ? (
                <Spinner />
              ) : props.ashReport.data && props.ashReport.types ? (
                <Table
                  clickHandlers={{ query_text: drillDownQuery }}
                  header={props.ashReport.types}
                  shorten={{ query_text: true }}
                  copy={{ query_text: true }}
                  data={ashToShow}
                  warningColumns={{ plan_info: true }}
                  infoColumns={{ optimizer_notes: true }}
                  aligns={cellAligns}
                  minWidths={{ query_text: "250px", last_run: "120px" }}
                  order={"desc"}
                  orderBy={"avg_elapsed_time_s"}
                />
              ) : null}
            </Card>
          </Grid>
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
    ashReport: state.ash.ashReport,
    ashReportLoading: state.ash.ashReport.loading,
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
    fetchAshReport: (cluster, from, to) =>
      dispatch(ashActions.ashReportFetch(cluster, from, to)),
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
)(Ash);
