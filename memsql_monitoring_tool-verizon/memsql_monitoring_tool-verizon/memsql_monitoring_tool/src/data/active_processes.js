export default {
  'active_processes': [
    {
      "database" : null,
      "user" : "root",
      "query" : "\/* ApplicationName=DBeaver 6.2.0 - Data transfer producer *\/ select db as 'database', user, info as 'query', state, time, plan_type, last_executed as 'last run', average_exec_time as 'avg. time', queued_time  from information_schema.processlist proc inner join information_schema.plancache plan on proc.plan_id = plan.plan_id where state != '' and state != 'Idle'",
      "state" : "executing",
      "time" : 0,
      "plan_type" : "MBC",
      "last run" : null,
      "avg. time" : null,
      "queued_time" : 0
    }
  ]}
  