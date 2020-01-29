import React, { Component } from "react";

import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import SortHeader from "./SortHeader/SortHeader";

import { stableSort, getSorting } from "./sortinglogic";
import { filterData } from "./filterlogic";


import config from "../../data/config";
import FilterHeader from "./FilterHeader/FilterHeader";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { Grid, Icon } from "tabler-react";
import {getData, getFilterData, getCluster, getClusterInfo} from "../../redux/selectors";
import { connect } from "react-redux";
import { setData, setFilter } from "../../redux/actions";
import axios from "axios";
import EditableCell from "../EditableCell";

const mapStateToProps = state => {
  const data = getData(state) ? getData(state) : {};
  const filter_data = getFilterData(state) ? getFilterData(state) : {};
  const cluster = getCluster(state);
  const cluster_info = getClusterInfo(state);

  return { data, filter_data, cluster, cluster_info };
};

const mapDispatchToProps = dispatch => {
  return {
    setData: data => dispatch(setData(data)),
    setFilter: filter => dispatch(setFilter(filter)),
  };
};

class CustomTable extends Component {
  state = {
    header: [],
    loaded: false,
    order: "desc",
    orderBy: null,
    type: null,
  };

  config;

  constructor(props) {
    super(props);
    this.state.table_id = props.table_id;
  }

  componentDidMount() {
    this.config = this.getConfig(this.state.table_id);
    this.setInitialData(this.props.type);
    this.setState({
      header: this.config.header,
      searchColumn: this.config.searchColumn,
      loaded: true,
      orderBy: this.config.header?this.config.header:null,
      columns_distinct: {}
    }
    );
  }


  setInitialData(type) {
    switch (type) {
      case "static":
        this.props.setData({ id: this.props.table_id, dataLoaded: [] });
        this.getData({});
        break;
      default:
        this.props.setData({ id: this.props.table_id, dataLoaded: [] });
    }
  }

  getData(filters) {
    const query = { filters: filters };
    query["table_id"] = this.props.table_id;
    query["cluster"] = this.props.cluster;
    console.log('query',query);
    axios.post("http://127.0.0.1:8000/api/", query).then(res => {
      console.log('response',res.data);
      if (this.props.type==='generic'){
        this.setState({
          header:res.data.columns
          }
        )
      }
      this.props.setData({
        id: this.props.table_id,
        dataLoaded: res.data.data,
    });
    this.setState({
        columns_distinct : this.getFilterOptions(this.config.filterable_columns)
    });
    });
  }


  getConfig(table_id) {
    return config[table_id];
  }

  orderByChangeHandler = (event, property) => {
    let newOrder = this.state.order;
    if (this.state.orderBy === property) {
      newOrder = newOrder === "desc" ? "asc" : "desc";
    }
    this.setState({
      orderBy: property,
      order: newOrder,
    });
  };

  handleChange = event => {
    let new_filter = {};
    new_filter[this.state.searchColumn] = event.target.value;
    new_filter["table_id"] = this.props.table_id;
    this.props.setFilter(new_filter);
  };

  search = event => {
    if (this.config["type"] !== "static") {
      let filters = this.props.filter_data[this.props.table_id]
        ? this.props.filter_data[this.props.table_id]
        : {};
      this.getData(filters);
    }
  };

  getFilterOptions(filterable_columns) {
    let columns_distinct = {};

    if (this.props.data[this.props.table_id] && filterable_columns) {
      this.props.data[this.props.table_id].forEach(function(row, index) {
        Object.keys(row).forEach(function(column) {
          if (filterable_columns.indexOf(column) > -1) {
            if (index === 0) {
              columns_distinct[column] = [row[column]];
            }
            if (columns_distinct[column].indexOf(row[column]) < 0) {
              columns_distinct[column].push(row[column]);
            }
          }
        });
      });
    }

    return columns_distinct;
  }

  inputFunc = (event,id,column,value) => {
    axios.post('http://127.0.0.1:8000/add_comment/',{ 'table':this.state.table_id,
                                                              'column':column,
                                                              'id':id,
                                                              'value':value})
      .then(res=>{
       console.log('successful comment update')
    })
  };

  render() {
    let table = null;
    let filter = null;
    if (this.state.loaded && this.state.header) {
      let dataFilter = this.props.filter_data[this.props.table_id] && this.props.type!=='generic'
        ? this.props.filter_data[this.props.table_id]
        : {};
      let initialSortedData = stableSort(
        this.props.data[this.props.table_id],
        getSorting(this.state.order, this.state.orderBy)
      );
      if (this.props.type!=='generic'){
        initialSortedData = filterData(initialSortedData, dataFilter);
      }

      table = (
        <Paper style={{overflowX: "auto"}}>
          <Table style={{width: "100%"}}>
            <SortHeader
              header={this.state.header}
              order={this.state.order}
              orderBy={this.state.orderBy}
              changeSort={this.orderByChangeHandler}
            />
            <TableBody>
              {initialSortedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(this.state.header).map((key, cellIndex) =>
                    this.config['editable_columns'] && this.config.editable_columns.includes(this.state.header[key]) ? (
                      <TableCell
                        children={
                          <EditableCell
                            column={this.config.header[key]}
                            onChange={this.inputFunc}
                            id={row[this.config.id_column]}
                            value={row[this.config.header[key]]}
                          />
                        }
                      />
                    ) : (
                      <TableCell
                        className={
                          this.config.colors &&
                          this.config.colors[this.config.header[key]]
                            ? this.config.colors[this.config.header[key]][
                            row[this.config.header[key]]] + "_cell" : ""
                        }
                      >
                        {row[this.state.header[key]]}
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    }
      if (!this.props.use_cluster || this.props.cluster){
      filter = (
        <div>
          <Grid.Row style={{ display: "flex" }}>
            <Grid.Col width={9}>
              <TextField
                id="standard-name"
                label="Search expression"
                style={{ display: "flex", flexWrap: "wrap" }}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
            </Grid.Col>
            <Grid.Col>
              <div style={{ textAlign: "center", paddingTop: "5%" }}>
                <Button
                  variant="contained"
                  style={{'background-color':'#467fcf','color':'white'}}
                  onClick={e => this.search(e)}
                >
                  Search
                  <Icon prefix="fe" name="arrow_right">
                    send
                  </Icon>
                </Button>
              </div>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>

            {
              this.props.cluster_info && this.props.use_cluster && this.props.cluster && this.props.cluster_info[this.props.cluster]?Object.keys(this.props.cluster_info[this.props.cluster]).map((key, cellIndex) => (
              <Grid.Col>
                <FilterHeader
                  table_id={this.state.table_id}
                  column={key}
                  isDate={false}
                  options={this.props.cluster_info[this.props.cluster][key]}
                />
              </Grid.Col>
            )):<div></div>}
            {
              this.state.columns_distinct?Object.keys(this.state.columns_distinct).map((key, cellIndex) => (
              <Grid.Col>
                <FilterHeader
                  table_id={this.state.table_id}
                  column={key}
                  isDate={false}
                  options={this.state.columns_distinct[key]}
                />
              </Grid.Col>
            )):<div></div>}
          </Grid.Row>
          <Grid.Row>
            { this.config? (
              Object.keys(this.config.dateFilter).map((key, cellIndex) => (
              <Grid.Col>
                <FilterHeader
                  table_id={this.state.table_id}
                  column={this.config.dateFilter[key]}
                  isDate={true}
                  dateType={key}
                />
              </Grid.Col>
            ))):<div></div>}
          </Grid.Row>
        </div>
      );
      }

    return (
      <div>
        <div>{filter}</div>
        {table}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomTable);
