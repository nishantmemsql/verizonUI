import * as actionTypes from './actionTypes';

export const addHostColor = (nodes) => {
  return {type: actionTypes.ADD_HOST_COLORS, nodes: nodes}
}

export const addNodeColor = (nodes) => {
  return {type: actionTypes.ADD_NODE_COLORS, nodes: nodes}
}

export const initHostColors = (nodes) => {
  return {type: actionTypes.INIT_HOST_COLORS, nodes: nodes}
}

export const initNodeColors = (nodes) => {
  return {type: actionTypes.INIT_NODE_COLORS, nodes: nodes}
}