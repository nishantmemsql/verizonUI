import React, {useEffect} from 'react';
import {connect} from 'react-redux';

import { Card, Table } from "tabler-react";

import Spinner from '../UI/Spinner/Spinner';
import {currentMemoryBreakdownFetch} from '../../redux/actions/tableDataActions';

const memoryBreakdownTable = (props) => {

  useEffect(() => {
    props.fetchActualMemoryBreakdown()
  }, [])
  
  let body = []
  if (props.memoryBreakdown) {
    props.memoryBreakdown.map((row, idx) =>{
      body.push(
        <Table.Row>
          <Table.Col>{row.node}</Table.Col>
          <Table.Col>{row.type}</Table.Col>
          <Table.Col>{row.memory_usage}</Table.Col>
          <Table.Col>{row.total_memory}</Table.Col>
          <Table.Col>{row.segment}</Table.Col>
          <Table.Col>{row.query}</Table.Col>
          <Table.Col>{row.background}</Table.Col>
          <Table.Col>{row.cache}</Table.Col>
          <Table.Col>{row.malloc}</Table.Col>
        </Table.Row>
      )
    })
  } else if (props.loading) {
    body = <Spinner />
  }

  return (
    <Card>
      <Card.Header>
        Memory Breakdown by node
      </Card.Header>
      <Card.Body style={{padding: "3px"}}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.ColHeader>Node</Table.ColHeader>
              <Table.ColHeader>Type</Table.ColHeader>
              <Table.ColHeader>Mem. Usage</Table.ColHeader>
              <Table.ColHeader>Total Mem.</Table.ColHeader>
              <Table.ColHeader>Segment</Table.ColHeader>
              <Table.ColHeader>Query</Table.ColHeader>
              <Table.ColHeader>Bkg</Table.ColHeader>
              <Table.ColHeader>Cache</Table.ColHeader>
              <Table.ColHeader>Malloc</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>{body}</Table.Body>
        </Table>
      </Card.Body>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    memoryBreakdown: state.tableData.memoryBreakdown.data,
    loading: state.tableData.memoryBreakdown.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchActualMemoryBreakdown: () => dispatch(currentMemoryBreakdownFetch()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memoryBreakdownTable);