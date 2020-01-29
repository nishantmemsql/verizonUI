import React from "react";

import { Grid, StatsCard } from "tabler-react";
import C3Chart from "react-c3js";

import ChartHeader from "./ChartHeader";

const COLORS = {
  rowstore_in_gb: "#2ca02c",
  comp_columnstore_in_gb: "#467fcf",
  uncomp_columnstore_in_gb: "#ff7f0e",
};

const sizeChart = props => {
  let currentValue = props.y[props.y.length - 1];
  return (
    <Grid.Col sm={6} lg={3}>
      <ChartHeader
        layout={2}
        dbsize={currentValue}
        dbname={props.database}
        type={props.type}
        chart={
          <C3Chart
            style={{ height: "100%" }}
            padding={{
              bottom: -10,
              left: -1,
              right: -1,
            }}
            data={{
              names: {
                data1: props.type + "(" + props.database + ")",
              },
              columns: [["data1", ...props.y]],
              type: "area",
            }}
            legend={{
              show: false,
            }}
            transition={{
              duration: 0,
            }}
            point={{
              show: false,
            }}
            tooltip={{
              format: {
                title: function(x) {
                  return "";
                },
              },
            }}
            axis={{
              y: {
                padding: {
                  bottom: 0,
                },
                show: false,
                tick: {
                  outer: false,
                },
              },
              x: {
                padding: {
                  left: 0,
                  right: 0,
                },
                show: false,
              },
            }}
            color={{
              pattern: COLORS[props.type] ? [COLORS[props.type]] : ["#467fcf"],
            }}
          />
        }
      />
    </Grid.Col>
  );
};

export default sizeChart;
