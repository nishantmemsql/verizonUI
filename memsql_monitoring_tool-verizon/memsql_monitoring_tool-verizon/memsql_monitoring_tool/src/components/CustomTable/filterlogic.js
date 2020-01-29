export const filterData = (array,filters) => {
    let tempArray = array;
    Object.keys(filters).forEach(function(column) {

      if (column !== 'startDate' && column !=='endDate' ){
          if (typeof(filters[column])==='string'){
            tempArray = tempArray.filter(element => element[column].includes(filters[column]))
          } else {
            tempArray = tempArray.filter(element => filters[column].length===0? true:filters[column].includes(element[column]))
          }
      }
    });
    return tempArray;
    //console.log(array.filter(element => element[filters.column]===0));
    //var filtered = Object.fromEntries(Object.entries(dict).filter(([k,v]) => v>1));
    //console.log(filtered);
};

