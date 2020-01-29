import React from "react";

import { FlexibleWidthXYPlot, XAxis, YAxis, LineMarkSeries } from "react-vis";

const queryDetails = props => {
  let currentData = [];
  let maxValue = 0;
  let allLabels = [];
  props.data.map((el, idx) => {
    maxValue =
      el.avg_elapsed_time_s > maxValue ? el.avg_elapsed_time_s : maxValue;
    el.avg_elapsed_time_s &&
      currentData.push({
        y: el.avg_elapsed_time_s ? parseFloat(el.avg_elapsed_time_s) : null,
        x: idx,
      });
    el.last_run ? allLabels.push(el.last_run) : allLabels.push(el.insert_ts);
  });
  return currentData.length > 0 ? (
    <div>
      <FlexibleWidthXYPlot
        //yDomain={[0, maxValue]}
        dontCheckIfEmpty={true}
        height={props.height ? props.height : 500}
      >
        <LineMarkSeries className="mark-series-example" data={currentData} />
        <XAxis tickFormat={v => allLabels[v]} tickLabelAngle={-30} />
        <YAxis />
      </FlexibleWidthXYPlot>
    </div>
  ) : (
    <div>No Data</div>
  );
};

export default queryDetails;
