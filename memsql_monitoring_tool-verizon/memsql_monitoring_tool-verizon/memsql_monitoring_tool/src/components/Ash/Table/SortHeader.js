import React, { Component } from "react";

import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel";

class SortHeader extends Component {
  render() {
    const { order, orderBy } = this.props;
    console.log("warn", this.props.warningColumns);
    const rows = this.props.header.map(x =>
      //TODO: fix numeric types based on props
      ({
        id: x,
        numeric:
          x === "query_text" || x === "last_run_timestamp" ? false : true,
        disablePadding: false,
        label: x,
      })
    );

    return (
      <TableHead>
        <TableRow>
          {rows.map((row, index) => (
            <TableCell
              key={row.id}
              style={{ padding: "4px 4px 4px 4px" }}
              sortDirection={orderBy === row.id ? order : false}
              align={this.props.aligns[row.label]}
              className={this.props.classes}
            >
              {this.props.warningColumns[row.label] ? null : (
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={event => this.props.changeSort(event, row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

export default SortHeader;
