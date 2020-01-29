import React, { useState } from "react";
import { format } from "d3";

import "../../../node_modules/react-vis/dist/style.css";

import "./UberChart.css";

import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  Hint,
  DiscreteColorLegend
} from "react-vis";

import Highlight from "./Highlight";

import Spinner from "../UI/Spinner/Spinner";

const dateParser = timestamp => {
  if (!timestamp) {
    return null;
  }
  let [date, time] = timestamp.split(" ");
  date = date
    .split("-")
    .slice(1)
    .join("-");
  //time = time.substring(0, time.length - 1)
  return (
    <text x="0" y="0" transform="rotate(-30)">
      <tspan
        x="0"
        dy="2.5em"
        className="unselectable"
        fill="#6b6b76"
        fontSize="11px"
      >
        {" "}
        {date}{" "}
      </tspan>
      <tspan
        x="0"
        dy="1em"
        className="unselectable"
        fill="#6b6b76"
        fontSize="11px"
      >
        {" "}
        {time}{" "}
      </tspan>
    </text>
  );
};

const tipStyle = {
  display: "flex",
  color: "#fff",
  background: "#000",
  alignItems: "center",
  padding: "5px",
};

const boxStyle = { height: "10px", width: "10px" };

const getHintText = data => {
  let text = "";
  Object.keys(data).map(host => {
    text += host + "\n";
  });
  return text;
};

const legendToggleHandler = (item, shownCharts) => {
  console.log(shownCharts)
  console.log(item)
}

const UberChart = props => {
  let [hoveredPos, setHoveredPos] = useState(false);
  let [showHint, toggleHint] = useState(false);
  let [hintText, setHintText] = useState("");

  let [lastDrawLocation, setLastDrawLocations] = useState(null);

  let [shownCharts, toggleChart] = useState(props.colors)
  
  //console.log("UBER Chart", props.actualData)

  let data = {};
  let allLabels = [];
  let allValues = [];
  let charts = [];
  let minY = null, maxY = null 
  if (props.actualData && props.colors) {
    Object.keys(props.actualData).map(host => {
      let tmp = [];
      allLabels = [];
      allValues = [];
      for (let i = 0; i < props.actualData[host].length; i++) {
        tmp.push({ x: i, y: props.actualData[host][i].y });
        allLabels.push(props.actualData[host][i].x);
        allValues.push(i);
        maxY = maxY < props.actualData[host][i].y ? props.actualData[host][i].y : maxY
        if (!minY) {
          minY = props.actualData[host][i].y
        } else {
          minY = minY > props.actualData[host][i].y ? props.actualData[host][i].y : minY
        }
      }
      data[host] = tmp;
    });
    Object.keys(data).map(host => {
      const color = props.colors ? props.colors.indexOf(host) : null;
      charts.push(
        <LineSeries
          key={host}
          data={data[host]}
          color={color}
          opacity={0.8}
          //onNearestXY={(v,event) => {
          //  showHint && setHoveredPos({x: event.index, y: event.innerY})
          //  showHint && setHintText(getHintText(data))
          //}}
        />
      );
    });
  }
  minY = minY * 0.95
  maxY = maxY * 1.05

  let finalValues = [];
  for (
    let i = 0;
    i < allValues.length;
    i = i + Math.floor(allValues.length / 10)
  ) {
    finalValues.push(i);
  }

  return props.actualData && props.colors ? (
    <div onDragStart={event => event.preventDefault()}>
      <FlexibleWidthXYPlot
        xDomain={
          lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]
        }
        yDomain={
          (lastDrawLocation && [lastDrawLocation.bottom, lastDrawLocation.top])
          || [minY, maxY]
        }
        height={props.height ? props.height : 350}
        colorType="linear"
        colorDomain={[0, props.colors.length / 2, props.colors.length]}
        colorRange={["#31ad6f", "#4431ad", "#ad313b"]}
        //onMouseUp={(event) => toggleHint(!showHint)}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        {charts}
        <Highlight onBrushEnd={area => setLastDrawLocations(area)} />
        {/*<XAxis tickValues={finalValues} tickSize={10} tickFormat={v => dateParser(allLabels[v])} tickLabelAngle={-30}/>
        <YAxis left={5}/>*/}
        <XAxis
          tickFormat={v => dateParser(allLabels[v])}
          tickLabelAngle={-30}
        />
        <YAxis
          tickFormat={tick => (
            <tspan className="unselectable">{format(".2s")(tick)}</tspan>
          )}
        />
        {showHint ? (
          <Hint value={hoveredPos}>
            <div style={tipStyle}>
              <div style={{ ...boxStyle }} />
              {hintText}
            </div>
          </Hint>
        ) : null}
      </FlexibleWidthXYPlot>
      <DiscreteColorLegend 
        items={props.colors?props.colors:[]} 
        orientation='horizontal'
        colorType="linear"
        colorDomain={[0, props.colors.length/2, props.colors.length]}
        colorRange={['#31ad6f', '#4431ad', '#ad313b']}
        onItemClick={(item, i) => legendToggleHandler(item, shownCharts)}
      />
    </div>
  ) : null;
};

export default UberChart;
