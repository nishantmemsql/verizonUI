export const getDataState = store => store.filters;

export const getData = store => getDataState(store) ?  getDataState(store).data : {};

export const getFilterData = store => getDataState(store) ? getDataState(store).filter_data : {};

export const getCluster = store => getDataState(store) ? getDataState(store).cluster : '';

export const getClusterInfo = store => getDataState(store) ? getDataState(store).cluster_info : [];
