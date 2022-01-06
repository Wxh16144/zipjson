export function isJsonString(str) {
  try {
    return (typeof JSON.parse(str) == "object")
  } catch (e) {
  }
  return false;
}

export default (json, cb = _ => _) => {
  if (isJsonString(json))
    return JSON.stringify(JSON.parse(json), null, 0)
  try {
    return JSON.stringify(json, null, 0)
  } catch (e) {
    cb(e)
  }
}