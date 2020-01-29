import React, { useState, useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@material-ui/core/Tooltip";
import { Warning, Info, FileCopyOutlined } from "@material-ui/icons";
import SortHeader from "./SortHeader";

import { stableSort, getSorting } from "./sortinglogic";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  paper: {
    marginTop: theme.spacing(3),
    width: "100%",
    overflowY: "auto",
    overflowX: "scroll",
    marginBottom: theme.spacing(2),
    "& table:first-child": {
      "& tr": {
        "& td:first-child, th:first-child": {
          backgroundColor: "#fff",
          position: "sticky",
          left: 0,
          zIndex: 999,
        },
        "& th:first-child": {
          zIndex: 1000,
        },
      },
    },
  },
  head: {
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
  },
  table: {
    minWidth: 650,
  },
  cell: {
    padding: "4px",
  },
}));

const table = props => {
  console.log(props);

  let [page, setPage] = useState(0);
  let [rowsPerPage, setRowsPerPage] = useState(10);

  let [warningTooltipOpen, setWarningTooltipOpen] = useState(false);

  let [order, setOrder] = useState(props.order);
  let [orderBy, setOrderBy] = useState(props.orderBy);

  let [sortedData, setSortedData] = useState(props.data);

  let [copied, setCopied] = useState(null);

  useEffect(() => {
    let initialSortedData = stableSort(props.data, getSorting(order, orderBy));
    setSortedData(initialSortedData);
  }, [order, orderBy, props.data]);

  let warningColumns = props.warningColumns || {};
  let infoColumns = props.infoColumns || {};
  let minWidths = props.minWidths || {};
  let aligns = props.aligns || {};
  let clickHandlers = props.clickHandlers || {};
  let shorten = props.shorten || {};
  let copy = props.copy || {};

  const openWarningTooltip = () => setWarningTooltipOpen(true);
  const closeWarningTooltip = () => setWarningTooltipOpen(false);

  const orderByChangeHandler = (event, property) => {
    let newOrder = order;
    if (orderBy === property) {
      newOrder = newOrder === "desc" ? "asc" : "desc";
    }
    setOrder(newOrder);
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const copyToClipboard = (text, idx) => {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("value", text);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    setCopied(idx);
    setInterval(() => {
      setCopied(null);
    }, 2000);
  };

  const classes = useStyles();

  return (
    <div>
      <div className={classes.paper} style={{ height: props.tableType === "processlist" ? "258px" : "" }}>
        <Table className={classes.table} size="small" stickyHeader>
          {/*<TableHead>
            <TableRow>
              {props.header.map((element, i) => (
                <TableCell
                  style={{padding: "6px 4px 6px 18px"}}
                  //align={element === 'query_text' ? "left": "right"}
                  align={aligns[element]}
                  className={classes.head}>
                  {warningColumns[element] ? null : element}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
              */}
          <SortHeader
            classes={classes.head}
            header={props.header}
            aligns={aligns}
            warningColumns={warningColumns}
            order={order}
            orderBy={orderBy}
            changeSort={orderByChangeHandler}
          />
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map((row, idx) => (
                <TableRow key={idx}>
                  {props.header.map(head => {
                    let cell = (
                      <TableCell
                        className={classes.cell}
                        style={{
                          minWidth: minWidths[head],
                        }}
                        align={aligns[head]}
                      >
                        {shorten[head] ? (
                          <React.Fragment>
                            <span
                              onClick={() =>
                                clickHandlers[head](row["activity_name"])
                              }
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              {row[head].slice(0, 20)}
                            </span>
                            <Tooltip title={row[head]}>
                              <span> ...</span>
                            </Tooltip>
                          </React.Fragment>
                        ) : (
                          <span
                            onClick={() =>
                              clickHandlers[head](row["activity_name"])
                            }
                          >
                            {row[head]}
                          </span>
                        )}
                        {copy[head] ? (
                          <Tooltip
                            PopperProps={{
                              disablePortal: true,
                            }}
                            open={idx === copied}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title="Copied!"
                            style={{ zIndex: 2000 }}
                            placement="right"
                          >
                            <FileCopyOutlined
                              fontSize="small"
                              onClick={() => copyToClipboard(row[head], idx)}
                            />
                          </Tooltip>
                        ) : null}
                      </TableCell>
                    );
                    if (warningColumns[head] && row[head]) {
                      cell = (
                        <TableCell className={classes.cell}>
                          <Tooltip title={row[head]}>
                            <Warning />
                          </Tooltip>
                        </TableCell>
                      );
                    } else if (infoColumns[head] && row[head]) {
                      cell = (
                        <TableCell
                          className={classes.cell}
                          style={{ padding: "4px", textAlign: "center" }}
                        >
                          <Tooltip title={row[head]}>
                            <Info />
                          </Tooltip>
                        </TableCell>
                      );
                    }
                    return cell;
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={props.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "previous page",
          }}
          nextIconButtonProps={{
            "aria-label": "next page",
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default table;
