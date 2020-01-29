import ashreport from "./ash_report";
import tickets from "./tickets";

export default {
  'logs': {
    'header': [ 'host', 'port', 'log_date', 'level', 'message'],
    'filterable_columns': ['level'],
    'searchColumn': 'message',
    'dateFilter': {'startDate': 'log_date', 'endDate': 'log_date'},
    'colors': {'level': {'INFO': 'success', 'ERROR': 'danger', 'WARN': 'warn'}}
  },
  'ash_report': {'header':Object.keys(ashreport.ash_report[0]),
                  'filterable_columns':['query_text', 'database_name'],
                  'searchColumn':'query_text',
                  'dateFilter':{}},
  'tickets': {'header':Object.keys(tickets.tickets[0]),
                  'filterable_columns':['EOG cluster', 'Host'],
                  'searchColumn':'commands',
                  'dateFilter':{}},
  'processlist': {
      'header': ['host','port','ID','USER','Source Host','DB','COMMAND','TIME','STATE','INFO'],
      'filterable_columns':['DB','STATE','USER'],
      'searchColumn':'INFO',
      'dateFilter':{}
  },
  'mv_events': {
      'header': ['CLUSTER',"EVENT_TIME","SEVERITY","EVENT_TYPE","DETAILS","TICKET","RCA"],
      'filterable_columns':['SEVERITY','EVENT_TYPE'],
      'searchColumn':'DETAILS',
      'colors': {'EVENT_TYPE': {'NODE_ONLINE': 'success', 'NODE_OFFLINE': 'danger', 'WARN': 'warn'}},
      'dateFilter':{},
      'editable_columns':['TICKET','RCA'],
      'id_column':'ID'
  },
  'custom':{
    'dateFilter':{},
    'searchColumn':'query'
  }

}
