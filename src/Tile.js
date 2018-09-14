import React, {
  Component
} from 'react';

import { fit2 } from './fit.js'
import { getImage, patchProfileURL, unesc } from './utils.js'
import Tweets from './Tweets'
import { Row, Col } from 'react-flexbox-grid';
import { SlideDown } from 'react-slidedown' 
import 'react-slidedown/lib/slidedown.css'
import { normalizeData } from './data'; 
import Sparkle from './Sparkle'
import Textfade from './Textfade'

function ConditionalImage(props) {
  let src = props.src
  if (props.img_type === "profile_image_url") {
    src = patchProfileURL(src)
  }
  if (src !== undefined) {
    return (<div className="image_frame" style={{ float: "left", height: '70px' }}>
      <span className="helper"></span>
      <img className="overlay_img" src={src} alt={"News Extract"} />
    </div>)
  } else {
    return (<div className="image_frame_blank" ></div>)
  }
}

function selectTail(label_info) {
  const tail = (label_info.type === 'external_link') ? label_info.domain : "@" + label_info.screen_name
  return tail
}


class Tile extends Component {
  constructor(props) {
    super(props)
    this.toggleSelect = this.toggleSelect.bind(this);
    const normData = normalizeData(this.props.item.data)
    const { src, img_type } = getImage(this.props.item.label_info)
    const imageWidth = (img_type !== undefined) ? 75 : 15
    const labelWidth = Math.ceil(this.props.widthLabel - imageWidth)
    const fullText = unesc(this.props.item.title)
    this.state = { tweets: [], selected: false, normData, labelWidth, imgSrc: src, img_type, fullText, list:this.props.meta.list} //0:closed, 1: opening, 2: closing
  }

  componentDidUpdate(){
    if(this.props.meta.list!==this.state.list){
      this.setState({list:this.props.meta.list})
    }
  }
  
  getText(tail) {
    const lines = (this.state.labelWidth > 400 ? 2 : 3)
    const tx = fit2(lines, this.props.item.title, tail, this.state.labelWidth)
    const main_text = tx.texts.join("")
    // const main_text = tx.texts.map(t => <span>{t}</span>)
    
    // main_text = main_text.join("")
    const topPadding = 76 / 2 - tx.texts.length * 10
    return { main_text, topPadding }
  }

  toggleSelect(e) {
    const selected = (this.props.selectedLabel === null)
    // const selectedIndex = (selected) ? 1 : 2
    this.setState({ selected })
    this.props.broadcastSelected(this.props.item.key)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((this.props.selectedLabel === this.props.item.key || nextProps.selectedLabel === this.props.item.key) && this.props.widthLabel > 0) {
      return true
    } else if (nextProps.zoom > this.props.zoom && this.props.item.count < nextProps.zoom && this.props.item.count >= this.props.zoom) {
      return true
    } else if (nextProps.zoom < this.props.zoom && this.props.item.count >= nextProps.zoom && this.props.item.count < this.props.zoom) {
      return true
    } else if(this.props.meta.list !== this.state.list){
      return true;
    }
    return false
  }

  render() {
    // console.log(this.props.selectedLabel, this.props.item.key, this.state.selected, this.props.previousSelected)
    let selectedIndex = 0
    if (this.props.selectedLabel !== null && this.props.item.key === this.props.selectedLabel) {
      selectedIndex = 1
    } else if (this.props.item.key === this.props.previousSelected) {
      selectedIndex = 0
    } 

    const tail = selectTail(this.props.item.label_info)
    const { main_text, topPadding } = this.getText(tail)

    const thinText = <span className="text_nohighlight">{main_text} <span className="tail">[{tail}]</span></span>
    const fullText = <a href={this.props.item.tag} target="_blank"><span className="text_highlight">{this.state.fullText} <span className="tail">[{tail}]</span></span></a>

    const visible = (this.props.zoom <= this.props.item.count) ? "on" : "off"
    const selected = (this.props.selectedLabel === this.props.item.key)
    
    return (
      <div className="totalContainer" onClick={this.toggleSelect}>

        <Row className={`fade_${visible}`}>
          <Col xs={10} md={8}>
            <div id="tile_container" className={`tile_container${(selected) ? "_selected" : ""}`}>
              <div id="header" className="main_detail" >
                <ConditionalImage src={this.state.imgSrc} img_type={this.state.img_type} />
                <div id="header_text" style={{ paddingTop: `${topPadding}px` }}>

                  <Textfade text1={thinText} text2={fullText} index={selectedIndex} width={this.state.labelWidth} />
                </div>
              </div>
            </div>
          </Col>
          <Col xs={2} md={4} className="main_detail">
            <Sparkle data={this.state.normData} height={34} width={this.props.widthGraph} meta={this.props.meta} />
          </Col>
        </Row>
        <Row>
          <Col xs={10} md={8}>
            <SlideDown className="react-slidedown" closed={!selected}>
              <Tweets tweets={this.props.item.data} selected={this.props.selectedLabel !== null} />
            </SlideDown>

          </Col>

        </Row>
      </div>
    );
  }
}

export default Tile;