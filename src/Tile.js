import React, {
  Component
} from 'react';

// import { fit2 } from './fit.js'
import fit3 from './fit.1.js'
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
    const normData = normalizeData(this.props.item.tweet_data)
    const { src, img_type } = getImage(this.props.item.label_info)
    const imageWidth = (img_type !== undefined) ? 75 : 18
    const labelWidth = Math.ceil(this.props.widthLabel - imageWidth) + 2
    const fullText = unesc(this.props.item.title)

    const tail = selectTail(this.props.item.label_info)
    const { mainTextNew, tailNew, topPaddingNew } = this.getText2(`... [${tail}]`, labelWidth)

    this.state = { tweets: [], normData, labelWidth, imgSrc: src, img_type, fullText, list:this.props.meta.list, text:{mainTextNew, tailNew, topPaddingNew}} //0:closed, 1: opening, 2: closing
  }

  componentDidUpdate(){
    if(this.props.meta.list!==this.state.list){
      this.setState({list:this.props.meta.list})
    } 
  }

  getText2(tail, labelWidth) {
    const lines = (this.props.widthLabel >= 350 ? 2 : 3)

    const {returnLinesText, returnLinesTailText, sep} = fit3 (lines, this.props.item.title, tail, labelWidth-2)

    const tailFlat = returnLinesTailText.text.flat()
    // const mainTextFlat = returnLinesText.text.flat()
    if(tailFlat[0] === "..."){
      tailFlat.shift()
      returnLinesText.textNew[returnLinesText.textNew.length-1] = returnLinesText.textNew[returnLinesText.textNew.length-1] + " ... "
    }
    const adjSep = (sep === "/") ? "/ " : sep
    const mainTextNew = returnLinesText.textNew.join(adjSep)

    const tailNew = tailFlat.join(" ")
    const topPaddingNew = 76 / 2 - returnLinesTailText.text.length * 10
    return { mainTextNew, tailNew, topPaddingNew }
  }

  toggleSelect(e) {
    this.props.broadcastSelected(this.props.item.key)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.zoom > this.props.zoom && this.props.item.count < nextProps.zoom && this.props.item.count >= this.props.zoom) {
      return true
    } else if (nextProps.zoom < this.props.zoom && this.props.item.count >= nextProps.zoom && this.props.item.count < this.props.zoom) {
      return true
    } else if(this.props.meta.list !== this.state.list){
      return true;
    } 
    if(nextProps.openState === "opening" || nextProps.openState === "closing"){
      return true
    }
    return false
  }

  render() {
    // const tail = selectTail(this.props.item.label_info)

    // let height = null
    // if(this.props.openState === 'opening'){
    //   //Calculate height
    //   const {returnLinesText, returnLinesTailText, sep} = fit3(15, this.props.item.title + "_" + tail, "tail", this.state.labelWidth)
    //   height = (returnLinesText.lengths.length > returnLinesTailText.lengths.length) ? returnLinesText.lengths.length : returnLinesTailText.lengths.length
    // }
    // const heightText = (height === null) ? "" : "(" + height + ")"
    // const { main_text, topPadding } = this.getText(tail)
    
    // const { mainTextNew, tailNew, topPaddingNew } = this.getText2(`... [${tail}]`)

    const thinText = <span className="text_nohighlight">{this.state.text.mainTextNew} <span className="tail">{this.state.text.tailNew}</span></span>
    const fullText = <a href={this.props.item.tag} target="_blank"><span className="text_highlight">{this.state.fullText} <span className="tail">{this.state.text.tailNew}</span></span></a>

    const visible = (this.props.zoom <= this.props.item.count) ? "on" : "off"
   
    const selected = (this.props.openState === 'opening')
    // const selected = (this.props.selectedLabel === this.props.item.key)
    
    return (
      <div className="totalContainer" onClick={this.toggleSelect} id={"tile_container_"+this.props.item.key}>

        <Row className={`fade_${visible}`}>
          <Col xs={10} md={8}>
            <div id="tile_container" className={`tile_container${(selected) ? "_selected" : ""}`}>
              <div id="header" className="main_detail" >
                <ConditionalImage src={this.state.imgSrc} img_type={this.state.img_type} />
                <div id="header_text" style={{ paddingTop: `${this.state.text.topPaddingNew}px` }}>
                  <Textfade text1={thinText} text2={fullText} index={(this.props.openState === "opening") ? 1 : 0} width={this.state.labelWidth} />
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
              <Tweets tweets={this.props.item.tweet_data} selected={this.props.openState === "opening"} />
            </SlideDown>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Tile;