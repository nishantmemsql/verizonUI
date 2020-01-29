import * as actionTypes from "./actionTypes";

export const setFromTs = timestamp => {
  return { type: actionTypes.SET_FROM_TS, fromTs: timestamp };
};

export const setToTs = timestamp => {
  return { type: actionTypes.SET_TO_TS, toTs: timestamp };
};
