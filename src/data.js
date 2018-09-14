
function bounds(obj, key){
  const arr = obj.map(item => item[key])
  return [Math.min(...arr), Math.max(...arr)]
}

function getInitialZoom(dist, steps) {
  const rowMax = 45;
  let total = 0;
  const revSteps = steps.slice().reverse()
  let startZoom = revSteps[revSteps.length - 1]
  for (const i in revSteps) {
    total += dist.get(revSteps[i])
    if (total >= rowMax) {
      startZoom = (i !== 0) ? revSteps[i - 1] : revSteps[0]
      break
    }
  }
  return startZoom
}

function getLevels(labels) {
  const keys = Object.keys(labels)
  const distrib = keys.reduce((dist, key) => {
    const cnt = labels[key].count
    return dist.set(cnt, (dist.has(cnt)) ? dist.get(cnt) + 1 : 1)
  }, new Map())

  const steps = Array.from(distrib.keys()).sort((a, b) => a > b)
  const startZoom = getInitialZoom(distrib, steps)
  return { steps, startZoom }
}

// function makeLabelDict(statuses) {
//   const labelMap = statuses.reduce((dataMap, status) => {
//     (dataMap.has(status.key)) ? dataMap.get(status.key).push(status) : dataMap.set(status.key, [status])
//     return dataMap
//   }, new Map)
//   return labelMap
// }

function addTweetsToLabels(labels, statuses) {
  for (const s of statuses) {
    const k = s.key
    const row = { date: s.date, count: s.count, user_id: s.user_id, tweet_id: s.tweet_id, screen_name: s.screen_name, profile_image_url: s.profile_image_url, text: s.text }
    if (labels[k] !== undefined) {
      (labels[k]["data"] !== undefined) ? labels[k]["data"].push(row) : labels[k]["data"] = [row]
    } else {
      console.log(`WTF? no ${k} in labels`)
    }
  }
  return labels
}

function makeMeta(labels, statuses) {
  const { steps, startZoom } = getLevels(labels)
  const [xMin, xMax] = bounds(statuses, "date") 
  const [yMin, yMax] = bounds(statuses, "count")
  return {steps, startZoom, xMeta:[xMin, xMax], yMeta:[yMin, yMax]}
}

function normalizeData(data, passedMap) {
  const map = {x:"date", y:"count"}
  const normData = data.map((pt, i) => {
    if (typeof pt === 'object') {
      return {x:pt[map["x"]], y:pt[map["y"]]}
    } else {
      return { x: i, y: pt }
    }
  })
  return normData
}

export {getLevels, getInitialZoom, addTweetsToLabels, makeMeta, normalizeData }