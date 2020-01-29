
export const getTimeWindow = (diff=6) => {
  const now = new Date();
  let before = new Date();
  before.setHours(before.getHours() - diff)
  return [before, now]
}

export const convertTimestamp = (ts) => {
  return ts.getFullYear() + 
    "-" + ("0" + (ts.getMonth() + 1)).slice(-2) + 
    "-" + ("0" + ts.getDate()).slice(-2) + 
    " " + ("0" + ts.getHours()).slice(-2) + 
    ":" + ("0" + ts.getMinutes()).slice(-2) + 
    ":" + ("0" + ts.getSeconds()).slice(-2)
} 
