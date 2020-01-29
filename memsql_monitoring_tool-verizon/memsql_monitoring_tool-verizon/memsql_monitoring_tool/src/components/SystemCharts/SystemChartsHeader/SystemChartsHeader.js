import React from "react";
import Picky from "react-picky";
import DatePicker from "react-datepicker";
import { Card } from "tabler-react";

import classes from "./SystemChartsHeader.module.css";

const systemChartsHeader = props => {
  return (
    <Card.Header>
      <Card.Title>{props.title}</Card.Title>
      <div style={{ display: "flex" }}>
        <div style={{ width: "150px", height: "40px", margin: "5px" }}>
          <Picky
            id={props.title}
            options={props.options}
            value={props.active}
            onChange={value => props.change(value)}
            dropdownHeight={400}
            keepOpen={false}
          />
        </div>
        {/*
        <h4 className={classes.fromto}>From:</h4>
        <DatePicker
            className={classes.DatePicker}
            selected={props.dateStart}
            onChange={props.setDateStart}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MM.d HH:mm"
          />
        <h4 className={classes.fromto}>To:</h4>
        <DatePicker
            className={classes.DatePicker}
            selected={props.dateEnd}
            onChange={props.setDateEnd}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MM.d HH:mm"
            popperModifiers={{
              preventOverflow: {
                enabled: true,
                escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                boundariesElement: 'viewport'
              }
            }}
          />*/}
      </div>
    </Card.Header>
  );
};

export default systemChartsHeader;
