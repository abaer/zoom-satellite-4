import React, { Component } from 'react';
import {
  scaleLinear,
  scaleSqrt
} from "d3-scale";

import {
  interpolateViridis
} from "d3-scale-chromatic"

const container = {
  display: "flex",
  alignItems: "center", //flex-end,
  justifyContent: "center",
  maxHeight: "73px",
}

const bar_base = {
  backgroundColor: "rgb(149, 216, 64)",
  width: 2,
}

class Sparkle extends Component {
  constructor(props) {
    super();
    const yScale = scaleSqrt().domain(props.meta.yMeta).range([5, props.height]);
    const xScale = scaleLinear().domain([props.meta.xMeta[0], props.meta.xMeta[1] + .1 * (props.meta.xMeta[1] - props.meta.xMeta[0])]).range([bar_base.width, props.width - bar_base.width]);
    const rangeData = props.data.map(pt => { return { x: xScale(pt.x), y: yScale(pt.y) } })
    const colr = (props.data[0].x - props.meta.xMeta[0]) / (props.meta.xMeta[1] - props.meta.xMeta[0])
    const hue = interpolateViridis((1 - colr * .95))
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
    const leftMargM1 = (i > 0) ? Math.floor(this.state.rangeData[i - 1].x - width * i) : 0
    let leftMarg = Math.floor(x - width * i - leftMargM1)
    if (leftMarg - width < 0) {
      // width = 1;
      leftMarg = .1
      // leftMarg = (leftMarg - 1 >=1) ? leftMarg - 1 : 0
    }
    return {
      ...bar_base,
      height: y,
      width: width,
      marginLeft: leftMarg,
      backgroundColor: this.state.hue,
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