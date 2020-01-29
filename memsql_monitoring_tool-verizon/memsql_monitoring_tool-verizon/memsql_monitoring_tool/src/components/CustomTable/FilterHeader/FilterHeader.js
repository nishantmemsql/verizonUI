import React, { Component } from "react";
import Picky from 'react-picky';
import 'react-picky/dist/picky.css';
import {setFilter} from "../../../redux/actions";
import {connect} from "react-redux";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

import moment from 'moment';


class FilterHeader extends Component {

  state = {
      value: null,
      column_name: this.props.column,
      arrayValue: [],
      filter: null,
      startDate: moment().toDate(),
      options:[]
    };


  constructor(props) {
    super(props);
    this.selectOption = this.selectOption.bind(this);
    this.selectMultipleOption = this.selectMultipleOption.bind(this);
    this.setTimeFilter = this.setTimeFilter.bind(this);
  }

  componentDidMount() {
    this.setState({
      options:this.transformOptions(this.props.options)
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      options : this.transformOptions(nextProps.options)
    })
  }


  transformOptions(options){
    let result = [];
    if (!this.props.isDate) {
      for (var i = 0; i < options.length; i++) {
        result.push({id: i + 1, name: options[i]})
      }
    }
    console.log('result');
    return result
  }

  selectOption(value) {
    this.setState({ filter:value });
    this.props.setFilter(value);
  }
  selectMultipleOption(value) {
    this.setState({ arrayValue: value });
    this.setState({ filter:value });

    let column = this.state.column_name;
    let array_value=[];
    value.map((el)=>array_value.push(el['name']));
    let new_filter = {};
    new_filter[column] = array_value;
    new_filter['table_id'] = this.props.table_id;
    this.props.setFilter(new_filter);
  }

  setTimeFilter(value){
    this.setState({startDate:value});
    let new_filter = {};
    new_filter[this.props.dateType] = moment(value).format('YYYY-MM-DD HH:mm:ss');
    new_filter['table_id'] = this.props.table_id;
    this.props.setFilter(new_filter);
  }

  render() {


    if (this.props.isDate) {
      return (
      <div>
                <DatePicker
                    selected={this.state.startDate}
                    onChange={this.setTimeFilter}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy MMMM d HH:mm:ss"
                />
      </div>);
    } else {
      return (
              <div>

                        <Picky
                              value={this.state.arrayValue}
                              options={this.state.options}
                              onChange={this.selectMultipleOption}
                              open={false}
                              placeholder={"Select "+this.state.column_name}
                              valueKey="id"
                              labelKey="name"
                              multiple={true}
                              includeSelectAll={true}
                              includeFilter={true}
                              dropdownHeight={600}
                        />
              </div>
            );
    }
  }
}

export default connect(null, { setFilter })(FilterHeader);
