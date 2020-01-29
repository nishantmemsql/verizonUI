import React, { useEffect } from "react";
import { connect } from "react-redux";

import { Card, Grid, StatsCard } from "tabler-react";
import Picky from "react-picky";

import SizeChart from "./SizeChart/SizeChart";
import Spinner from "../UI/Spinner/Spinner";

import * as sizeActions from "../../redux/actions/sizeActions";

const SizeCharts = props => {
  useEffect(() => {
    props.fetchSizes();
  }, []);

  let charts = props.sizes ? (
    <Grid.Row>
      {props.activeTypes.map(type =>
        props.activeDBs.map(database => (
          <SizeChart
            key={type + database}
            type={type}
            database={database}
            x={props.sizes[type][database].x}
            y={props.sizes[type][database].y}
          />
        ))
      )}
    </Grid.Row>
  ) : null;

  return (
    <Card style={{ padding: "5px" }}>
      <Card.Header>
        <Card.Title>Database and table sizes</Card.Title>
        <Picky
          id="database picky"
          options={props.databases}
          value={props.activeDBs}
          onChange={value => props.changeSelectedDatabases(value)}
          dropdownHeight={400}
          keepOpen={false}
          multiple={true}
          includeSelectAll={true}
        />
        <Picky
          id="size type picky"
          options={props.types}
          value={props.activeTypes}
          onChange={value => props.changeSelectedTypes(value)}
          dropdownHeight={400}
          keepOpen={false}
          multiple={true}
          includeSelectAll={true}
        />
      </Card.Header>
      {props.isLoading ? <Spinner /> : charts}
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    sizes: state.sizes.data,
    isLoading: state.sizes.loading,
    activeTypes: state.sizes.activeTypes,
    activeDBs: state.sizes.activeDBs,
    databases: state.sizes.databases,
    types: state.sizes.data ? Object.keys(state.sizes.data) : [],
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSizes: () => dispatch(sizeActions.sizesFetch()),
    changeSelectedTypes: newSelection =>
      dispatch(sizeActions.changeSelectedTypes(newSelection)),
    changeSelectedDatabases: newSelection =>
      dispatch(sizeActions.changeSelectedDatabases(newSelection)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SizeCharts);
