
import React, {
  Component
} from 'react';

const container = {
  position: "relative",
}

class TextFade extends Component {
  constructor(props) {
    super(props)
    this.state = { initial: true } //initial:closed, 1: closed, 2: opening
    this.thin_styles = ["thin_show_anim_quick","thin_show_anim",  "thin_hide"]
    this.full_styles = ["full_hide", "full_hide full_hide_anim", "full_show"]
  }

   componentDidMount() {
    this.setState({initial:false})
  }

  render() {
    const index = (this.state.initial === true) ? 0 : this.props.index + 1
    const width = this.props.width +1
    return (
      <div style={container}>
        <div style={{ width, zIndex:"10", backgroundColor:"white", }} className={this.thin_styles[index]} >{this.props.text1}</div>
        <div style={{ width, zIndex:"11", backgroundColor:"white",  }} className={this.full_styles[index]}>{this.props.text2}</div>
      </div>
    );
  }
}

export default TextFade