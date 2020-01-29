import React, { useState } from "react";
import Spinner from "../UI/Spinner/Spinner";

import C3Chart from "react-c3js";

const chart = props => {
  let [xLine, setXLine] = useState(null);

  let names = {};

  let max = props.actualData
    ? props.actualData[Object.keys(props.actualData)[0]].maxY
    : 0;

  return props.actualData ? (
    <C3Chart
      style={{ height: "15rem" }}
      data={{
        columns: Object.keys(props.actualData).map((host, idx) => {
          return ["data" + (idx + 1), ...props.actualData[host].y];
        }),
        groups: [Object.keys(props.actualData)],
        colors: {
          //data1: colors["blue"],
        },
        names: names,
        onclick: (d, element) => console.log(d.index),
      }}
      axis={{
        y: {
          max: max > 100 ? max * 1.1 : 100,
          min: 0,
        },
        x: {
          padding: {
            left: 0,
            right: 0,
          },
          show: true,
        },
      }}
      /*legend={{
        position: "inset",
        padding: 0,
        inset: {
          anchor: "top-left",
          x: 20,
          y: 8,
          step: 10,
        },
      }}*/
      tooltip={{
        format: {
          title: function(x) {
            return "";
          },
          value: (value, ratio, id, x) => {
            return "";
          },
        },
      }}
      padding={{
        bottom: 0,
        left: 25,
        right: 0,
      }}
      point={{
        show: false,
      }}
      grid={
        /*xLine
        ?{
        x: {
          lines: [
            {value: xLine, text: ""}
          ]
        }
      }:*/ null
      }
    />
  ) : (
    <Spinner />
  );
};
export default chart;
