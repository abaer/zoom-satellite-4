function between(min, max, val) {
  return Math.min(max, Math.max(min, parseInt(val, 10)))
}

function rFromScale(scale, max_label_count) {
    const roundScale = Math.round(scale)
    return between(2, max_label_count, max_label_count - roundScale)
  }

function scaleFromR(scale, max_label_count){
  return max_label_count - scale
}

let oldFns = {}

function wideFn(e){
  e.preventDefault();
}

const zoom2 = (targ, r, stateHandlerFn, levels) => {
  const wideTarg = document.getElementsByTagName("body")[0]
  wideTarg.removeEventListener("gesturestart", wideFn)
  wideTarg.addEventListener("gesturestart", wideFn)
  // const targ = document.getElementById('root')
  let max_label_count = levels.length+1
  let candidateScale, correction, candidateR
  const multiplier = 2
  

  //Event handling
  function render(candidateScale){
    const candidate_zoom = rFromScale(candidateScale, max_label_count)
    const raw_candidate_zoom = max_label_count - candidateScale
    if (candidate_zoom !== r && ((raw_candidate_zoom - r) > .5 || (r - raw_candidate_zoom) > .4)) {
      r =candidate_zoom
      stateHandlerFn(levels[r-2])
    }
    return false
  }

  function gesturestart(e) {
    e.preventDefault();
    console.log("gesturestart")
    candidateR = r;

    correction = scaleFromR(candidateR, max_label_count) - multiplier * e.scale
    return false
  }

  const gesturechange = (e) => {
    e.preventDefault();
    candidateScale = correction + multiplier * e.scale
    render(candidateScale);
    return false
  }

  function gestureend(e) {
    // console.log(e.target)
    e.preventDefault();
    return false
  }

  //remove old functions if they exist before assigning handlers

  const removeOldHandlers = (oldFns) => {
    const okeys = Object.keys(oldFns)
    for (const okey of okeys){
      targ.removeEventListener(okey, oldFns[okey]);  
    }
  }

  const addZoomHandlers = () => {
    const eventhandlers = {"gesturestart":gesturestart, "gesturechange":gesturechange, "gestureend":gestureend}
     //stash old function so we can remove them when list changes
    oldFns = eventhandlers
    const keys = Object.keys(eventhandlers)
    for (const key of keys){
      // targ.removeEventListener(key, eventhandlers[key]);  
      targ.addEventListener(key, eventhandlers[key])
    }
  }
  removeOldHandlers(oldFns)
  addZoomHandlers()
}

export { zoom2 }