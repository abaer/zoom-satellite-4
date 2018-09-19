function getInitialZoom(dist, steps) {
  const rowMax = 40;
  for (const zoom of steps) {
    if (dist[zoom] <= rowMax) {
      return zoom
    }
  }
  return steps[steps.length - 1]
}

function normalizeData(data, passedMap) {
  const map = {
    x: "date",
    y: "count"
  }
  const normData = data.map((pt, i) => {
    if (typeof pt === 'object') {
      return {
        x: pt[map["x"]],
        y: pt[map["y"]]
      }
    } else {
      return {
        x: i,
        y: pt
      }
    }
  })
  return normData
}

export {
  getInitialZoom,
  normalizeData,
}