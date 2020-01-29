// @flow

import React, { useEffect } from "react";
import { connect } from "react-redux";

import * as chartActions from "./redux/actions/chartActions";

import { ArrowRightRounded } from "@material-ui/icons";

import { Page, Grid } from "tabler-react";

import SiteWrapper from "./SiteWrapper";

import SystemCharts from "./components/SystemCharts/SystemCharts";

import * as tableDataActions from "./redux/actions/tableDataActions";
import { getCluster } from "./redux/selectors";
import Filters from "./components/Filters/Filters";

const Home = props => {
  /*useEffect(() => {
    props.fetchSkews(props.cluster);
  }, []);
  */
  const fetchByTimestamp = () => {
    props.fetchAll(localStorage.getItem("cluster"), props.fromTs, props.toTs);
  };

  return (
    <SiteWrapper>
      <Page.Content>
        <div>
        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
          <Filters onRun={() =>
                props.fetchAll(
                  localStorage.getItem("cluster"),
                  props.fromTs,
                  props.toTs
                )}/>
        </Grid>
        </div>
        <div>
        <Grid.Row>
          {props.cluster ? <SystemCharts /> : null}

            <Grid.Col md={6}>
              <Grid.Row>
                <Grid.Col sm={12} />
              </Grid.Row>
            </Grid.Col>
          </Grid.Row>
        </div>
      </Page.Content>
    </SiteWrapper>
  );
};

const mapStateToProps = state => {
  return {
    cluster: state.filters.cluster,
    skews: state.tableData.skew,
    fromTs: state.filters.fromTs,
    toTs: state.filters.toTs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSkews: cluster => dispatch(tableDataActions.skewFetch(cluster)),
    fetchAll: (cluster, from, to) =>
      dispatch(chartActions.fetchAll(cluster, from, to)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
