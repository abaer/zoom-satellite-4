import React, { Component } from 'react';
import './App.css';
import Tile from './Tile'
import Toolbar from './Toolbar'
import { getDateString } from './utils.js'
import { zoom2 } from './zoom.js'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { addTweetsToLabels, makeMeta } from './data';

class App extends Component {
  constructor(props) {
    super(props);
    this.stateSetterLight = this.stateSetterLight.bind(this);
    this.wx = React.createRef()
    this.labelSelectorBroadcast = this.labelSelectorBroadcast.bind(this);
    this.state = { labels: {}, statuses: [], zoom: 2, selectedLabel: null, wx: 0 };
  }
  labelSelectorBroadcast(key) {
    const selectedLabel = (this.state.selectedLabel === null) ? key : null
    this.setState({ selectedLabel })
  }


  stateSetterLight(r) {
    console.log("r")
    this.setState({ zoom: r });
  }

  componentDidMount() {
    console.log(this.wx.current.offsetWidth)
   
    this.setState({ wx: this.wx })
  }

  componentWillMount = () => {
    const dt = getDateString()
    //const list_dir = 'test_dir_om_2'
    const list_dir = 'gen_two'
    const defaultUrl = `https://s3.amazonaws.com/twitter-satellite/data-aws/${list_dir}/production/d3-${dt}.json`
    // const defaultUrl = `https://s3.amazonaws.com/twitter-satellite/data-aws/test_dir_om_2/production/d3-${dt}.json`
    fetch(defaultUrl)
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        const d_all = JSON.parse(myJson)
        const meta = makeMeta(d_all.labels, d_all.statuses)
        
        addTweetsToLabels(d_all.labels, d_all.statuses)

        this.setState({ statuses: d_all.statuses, labels: d_all.labels, zoom: meta.startZoom, meta})
        console.log(this.state)
        zoom2(meta.startZoom, this.stateSetterLight, meta.steps)
      });
  }

  render() {
    return (

      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Twitter satellite</h1>
        </header>
        <div id="zoom-frame" style={{ width: "100%", position: "absolute", left: "0px", margin:'0px', padding:'0px' }}>
          <Grid fluid>
          {/*Test Grid for sizing */}
            <Row>
              <Col xs={0} md={1} lg={1}></Col><Col xs={12} md={10} lg={9}>
                <Row style={{ height: "0px" }}>
                  <Col style={{ border: "0px yellow solid" }} xs={10} md={9}><div ref={this.wx}> </div></Col>
                  <Col style={{ border: "0px yellow solid" }} xs={2} md={3}><div> </div></Col>
                </Row>
              </Col>
            </Row>
            {/*Test Grid for sizing */}

            <Row>
              <Col xs={0} md={1} lg={1}><Row></Row></Col>  
                <Col xs={12} md={10} lg={9}>
                            <Row>
              <Col xs={12}>
                <Toolbar zoom={this.state.zoom} />
              </Col>
            </Row>
                {Object.keys(this.state.labels).map((key, i) => {
                  return (
                    <div key={`row_${i}`}> <Tile item={this.state.labels[key]} zoom={this.state.zoom} selectedLabel={this.state.selectedLabel} broadcastSelected={this.labelSelectorBroadcast} wx={this.state.wx} meta={this.state.meta}/> </div>)
                }
                )}
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default App;