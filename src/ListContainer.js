import { Component } from 'react';

class ListContainer extends Component {
  constructor(props) {
    super(props)
    this.toggleSelect = this.toggleSelect.bind(this);
    this.state = { count: this.props.item.count, selected: false, tweets: [] }
  }

  toggleSelect(oldselect) {
    const newState = (oldselect) ? false : true

    if (!oldselect) {
      const tweets = this.props.getter(this.props.item.key)
      this.setState({ tweets })
    } else (
      this.setState({ tweets: [] })
    )
    // this.setState({ selected: newState })
    setTimeout(() => this.setState({ selected: newState }), 100)
  }

  render() {
  }

}


export default ListContainer;