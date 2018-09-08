import React, {
  Component
} from 'react';

import { fit2 } from './fit.js'
import { getImage, patchProfileURL } from './utils.js'
import Tweets from './Tweets'
import { Row, Col } from 'react-flexbox-grid';
import { SlideDown } from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import { normalizeData } from './data';
import Sparkle from './Sparkle'

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
    this.state = { tweets: [], selected: false, normData }
  }

  getText(tail, img_type) {
    const imageWidth = (img_type !== undefined) ? 88 : 20
    const width = this.props.widthLabel - imageWidth
    const lines = (width > 400 ? 2 : 3)
    const tx = fit2(lines, this.props.item.title, tail, width)
    const main_text = (!this.state.selected) ? tx.texts.join(" ") : this.props.item.title
    const topPadding = 76 / 2 - tx.texts.length * 10
    return { main_text, topPadding }
  }

  toggleSelect(e) {
    const selected = (this.props.selectedLabel === null)
    this.setState({ selected })
    this.props.broadcastSelected(this.props.item.key)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((this.props.selectedLabel === this.props.item.key || nextProps.selectedLabel === this.props.item.key) && this.props.widthLabel > 0) {
      return true
    } else if(nextProps.zoom > this.props.zoom && this.props.item.count < nextProps.zoom && this.props.item.count >= this.props.zoom ){
      return true
    } else if(nextProps.zoom < this.props.zoom && this.props.item.count >= nextProps.zoom && this.props.item.count < this.props.zoom){
      return true
    }
    return false
  }

  render() {
    const tail = selectTail(this.props.item.label_info)
    const { src, img_type } = getImage(this.props.item.label_info)
    const visible = (this.props.zoom <= this.props.item.count) ? "on" : "off"
    const selected = (this.props.selectedLabel === this.props.item.key)
    const { main_text, topPadding } = this.getText(tail, img_type)
    const highlightClass = (selected) ? "text_highlight" : "text_nohighlight"
    return (
      <div className="totalContainer" onClick={this.toggleSelect}>

        <Row className={`fade_${visible}`}>
          <Col xs={10} md={9}>
            <div id="tile_container" className={`tile_container${(selected) ? "_selected" : ""}`}>
              <div id="header" className="main_detail" >
                <ConditionalImage src={src} img_type={img_type} />
                <div id="header_text" style={{ paddingTop: `${topPadding}px` }}>
                  <a href={this.props.item.tag} className={(selected) ? "" : 'disabled-link'} target={(selected) ? "" : "_blank"} >
                    <span className={highlightClass}>{main_text} <span className={`tail`}>[{tail}]</span></span>
                  </a>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={2} md={3} className="main_detail">
            <Sparkle data={this.state.normData} height={30} width={this.props.widthGraph} meta={this.props.meta} />
          </Col>
        </Row>
        <Row>
          <Col xs={10} md={9}>
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