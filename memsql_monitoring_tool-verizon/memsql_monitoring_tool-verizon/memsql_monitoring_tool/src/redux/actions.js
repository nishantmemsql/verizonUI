export const setFilter = filter => ({ type: 'SET_FILTER', payload: { filter } });

export const setData = data => ({ type: 'SET_DATA', payload: { data } });

export const setCluster = data =>  ({ type: 'SET_CLUSTER', payload: { data } });

export const setClustersInfo = (data, storedCluster ) =>  ({ type: 'SET_CLUSTER_INFO', payload: { data, storedCluster } });
