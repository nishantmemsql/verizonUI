import React, { useState, useEffect } from "react";
import { format } from "d3";

import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  AreaSeries,
  VerticalGridLines,
  DiscreteColorLegend,
  Highlight,
  Hint,
} from "react-vis";

const dateParser = timestamp => {
  let [date, time] = timestamp.split(" ");

  date =
    date
      .split("-")
      .slice(1)
      .join("-") + "\n";
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

const areaChart = props => {
  let [crosshairValues, setCrosshairValues] = useState([]);

  let [lastDrawLocation, setLastDrawLocations] = useState(null);

  let areaSeries = [];
  let categories = [];

  const zoomIn = area => {
    setLastDrawLocations(area);
    if (area) {
      //console.log("from", props.xLabels[parseInt(area.left)])
      //console.log("to", props.xLabels[parseInt(area.right)])
      props.setTimeWindow(
        props.xLabels[parseInt(area.left)],
        props.xLabels[parseInt(area.right)]
      );
    }
  };

  const crosshairChangeHandler = x => {
    setCrosshairValues(
      props.series.map(s => ({
        type: s.title,
        y: s.data[x].y,
        timestamp: props.xLabels[x],
      }))
    );
  };

  if (props.series) {
    props.series.map((s, i) => {
      categories.push(s.title);
      areaSeries.push(
        <AreaSeries
          data={s.data}
          opacity={s.disabled ? 0.1 : 0.5}
          onNearestX={value => crosshairChangeHandler(value.x)}
        />
      );
    });
  }
  // TODO: force component to rerender
  const clickHandler = (item, i) => {
    if (props.series) {
      props.series[i].disabled = !props.series[i].disabled;
    }
  };

  return (
    <div>
      {props.categories ? (
        <DiscreteColorLegend
          items={categories}
          onItemClick={clickHandler}
          orientation="horizontal"
        />
      ) : null}

      <FlexibleWidthXYPlot
        xDomain={
          lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]
        }
        yDomain={
          lastDrawLocation && [lastDrawLocation.bottom, lastDrawLocation.top]
        }
        onMouseLeave={() => setCrosshairValues([])}
        height={300}
        stackBy="y"
      >
        <VerticalGridLines />
        <HorizontalGridLines />

        <XAxis
          tickFormat={v => dateParser(props.xLabels[v])}
          tickLabelAngle={-30}
        />
        <YAxis
          tickFormat={tick => (
            <tspan className="unselectable">{format(".2s")(tick)}</tspan>
          )}
        />
        {areaSeries}
        <Highlight onBrushEnd={area => zoomIn(area)} />
        {/*
          <Crosshair values={crosshairValues}>
          <div style={{background: 'black'}}>
            {crosshairValues.map(v => (<p>{v.type}: {v.y}</p>))}
          </div>
          </Crosshair>
          */}
      </FlexibleWidthXYPlot>
    </div>
  );
};

export default areaChart;
