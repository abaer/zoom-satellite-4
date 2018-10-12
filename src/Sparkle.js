import React, { Component } from 'react';

import {
  interpolateViridis
} from "d3-scale-chromatic"

const container = {
  display: "flex",
  alignItems: "center", //flex-end,
  justifyContent:"center",
  maxHeight:"73px",
  marginLeft:-6,
}

const bar_base = {
  backgroundColor: "rgb(149, 216, 64)",
  width:2,
}

class Sparkle extends Component {
  constructor(props) {
    super();
    const yScale = props.meta.yScale
    const xScale = props.meta.xScale
    const rangeData = props.data.map(pt => {return {x:xScale(pt.x), y:yScale(pt.y)}})
    // const minX = Math.min(...props.data.map(d=>d.x))
    const colr = (props.data[0].x - props.meta.xMeta[0])/(props.meta.xMeta[1]- props.meta.xMeta[0])
    const hue = interpolateViridis((1-colr*.95))
    const barWidth = 2.5
    this.state = {
      rangeData,
      barWidth,
      hue
    };
   
  }

  
  bar(x, y, i, all) {
    let width = this.state.barWidth
    // const width = (this.state.minXGap > 2) ? 2 : 1
    // const leftMargM1 = (i > 0) ? Math.floor(this.state.rangeData[i-1].x - width*i) : 0
    let leftMarg = (i > 0) ? Math.floor(x - this.state.rangeData[i-1].x - width) : Math.floor(x)
    if(leftMarg  < width -1){
      leftMarg = leftMarg +.5
      // width = 1;
    }
    
    return {
      ...bar_base,
      left:x,
      height: y,
      width: width,
      marginLeft: leftMarg,
      backgroundColor:this.state.hue,
    }
  }

  render() {
    return (
        <div style={container}>
          {this.state.rangeData.map((d, i, all) => {
            const style = this.bar(d.x, d.y, i, all)
            return (<div style={style} key={`sparkle_${i}`}></div>)
          })}
        </div>
    );
  }
}

export default Sparkle