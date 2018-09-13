function between(min, max, val) {
  return Math.min(max, Math.max(min, parseInt(val)))
}

function rFromScale(scale, max_label_count) {
    const roundScale = Math.round(scale)
    return between(2, max_label_count, max_label_count - roundScale)
  }

function scaleFromR(scale, max_label_count){
  return max_label_count - scale
}

const zoom2 = (targ, r, stateHandlerFn, levels) => {
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

  function gesturechange(e){
    e.preventDefault();
    candidateScale = correction + multiplier * e.scale
    render(candidateScale);
    return false
  }

  function gestureend(e) {
    e.preventDefault();
    return false
  }
  console.log("targ", targ)
  const eventhandlers = {"gesturestart":gesturestart, "gesturechange":gesturechange, "gestureend":gestureend}
  const keys = Object.keys(eventhandlers)
  for (const key of keys){
    targ.removeEventListener(key, eventhandlers[key], true);  
    targ.addEventListener(key, eventhandlers[key], true)
  }
}

export { zoom2 }