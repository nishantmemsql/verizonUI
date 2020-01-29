import React from "react";

import { Card, Text, Header, Icon } from "tabler-react";

import classes from "./ChartHeader.module.css";

const ChartHeader = props => {
  return (
    <Card>
      <Card.Body className={classes.cardBody}>
        <div className={classes.value}>{props.dbsize} GB</div>
        <Header.H4 className={classes.dbname}>{props.dbname}</Header.H4>
        <Text muted>{props.type}</Text>
      </Card.Body>
      <div className={classes.cardChart}>{props.chart}</div>
    </Card>
  );
};

export default ChartHeader;
