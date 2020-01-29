import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";

import { Page, Grid, Card } from "tabler-react";
import { ArrowRightRounded } from "@material-ui/icons";

import * as filterActions from "../../redux/actions/filterActions";

import { convertTimestamp } from "../../helpers";
import ClusterSelect from "../ClusterSelect";

const styles = theme => ({
  smallButton: {
    padding: 6
  },
  largeButton: {
    padding: 24
  },
  largeIcon: {
    fontSize: "4em",
    align: "center",
    justify: "center"
  },
  input: {
    display: "none"
  }
});    

const filters = props => {

  const { classes } = props;
  
  const setConvertedFromTs = ts => {
    props.setFromTs(convertTimestamp(ts));
  };

  const setConvertedToTs = ts => {
    props.setToTs(convertTimestamp(ts));
  };

  return (
    <React.Fragment>
      <Grid.Row>
      <div style={{float:"left", display:"inline", width: "25%", padding: "10px"}}>
        <ClusterSelect />
      </div>
      <div style={{float:"right", display:"inline", width: "40%"}}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} >
          <KeyboardDateTimePicker
            variant="inline"
            format="yyyy-MM-dd h:mm a"
            margin="normal"
            id="datetime-local"
            label="Start (UTC)"
            value={props.fromTs}
            onChange={setConvertedFromTs}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardDateTimePicker
            variant="inline"
            format="yyyy-MM-dd h:mm a"
            margin="normal"
            id="datetime-local"
            label="End (UTC)"
            value={props.toTs}
            onChange={setConvertedToTs}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          </MuiPickersUtilsProvider>
          <ArrowRightRounded
            fontSize="large"
            onClick={props.onRun}
            style={{ cursor: "pointer"}}
            className={classes.largeIcon}
          />
        </div>
        </Grid.Row>
      </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    fromTs: state.filters.fromTs,
    toTs: state.filters.toTs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setFromTs: t => dispatch(filterActions.setFromTs(t)),
    setToTs: t => dispatch(filterActions.setToTs(t)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(filters));
