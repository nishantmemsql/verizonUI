import React, { Component } from "react";

import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel";

class SortHeader extends Component {
  render() {
    const { order, orderBy } = this.props;

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
        <TableRow style={{'background-color':'#467fcf'}}>
          {rows.map((row, index) => (
            <TableCell
              style={index === 0 ? { visibility: "visible",'color':'white' } : {'color':'white'}}
              key={row.id}
              align={"center"}
              padding={row.disablePadding ? "none" : "default"}
              sortDirection={orderBy === row.id ? order : false}
            >
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
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

export default SortHeader;
