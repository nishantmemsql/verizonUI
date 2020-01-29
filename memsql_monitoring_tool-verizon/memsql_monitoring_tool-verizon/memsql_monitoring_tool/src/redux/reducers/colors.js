import * as actionTypes from '../actions/actionTypes';

export const hostColorSelector = (state) => {
  let hosts = Object.keys(state.colors.hosts)
  hosts.sort()
  return hosts
}

export const nodeColorSelector = (state) => {
  let nodes = Object.keys(state.colors.nodes)
  nodes.sort()
  return nodes
}

const initialState = {
  hosts : {},
  nodes: {}
}

const colorReducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.ADD_NODE_COLORS:
      let newNodeColors = {...state.nodes}
      action.nodes.map(node => {newNodeColors[node] = true})
      return {
        ...state,
        nodes: {...newNodeColors}
      }
    case actionTypes.ADD_HOST_COLORS:
      let newHostColors = {...state.hosts}
      action.nodes.map(node => {newHostColors[node] = true})
      return {
        ...state,
        hosts: {...newHostColors}
      }
    case actionTypes.INIT_NODE_COLORS:
      let nodes = {}
      action.nodes.map(node => {nodes[node] = true})
      return {
        ...state,
        nodes: nodes
      }
    case actionTypes.INIT_HOST_COLORS:
        let hosts = {}
        action.nodes.map(host => {hosts[host] = true})
        return {
        ...state,
        hosts: hosts
      }
    default:
      return state
  }
}

export default colorReducer;