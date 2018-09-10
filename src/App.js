import React, { Component } from 'react';
import './App.css';
import Tile from './Tile'
import Toolbar from './Toolbar'
import { getDateString } from './utils.js'
import { zoom2 } from './zoom.js'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { addTweetsToLabels, makeMeta } from './data';
import {scaleLinear, scaleSqrt} from "d3-scale";

class App extends Component {
  constructor(props) {
    super(props);
    this.stateSetterLight = this.stateSetterLight.bind(this);
    this.labelSelectorBroadcast = this.labelSelectorBroadcast.bind(this);
    this.state = { labels: {}, statuses: [], zoom: 2, selectedLabel: null, widthLabel: 0, widthGraph: 0 };
    this.ts = {}
  }

  stateUpdater(update, transientState) {
    this.ts = { ...this.ts, ...update }
    const keys = new Set(Object.keys(this.ts))
    const needKeys = ["widthLabel", "widthGraph", "statuses", "labels", "meta"]
    for (const k of needKeys) {
      if (!keys.has(k)) {
        return
      } 
    }
    //Set up range functions once and pass to Sparkles
    this.ts.meta.yScale = scaleSqrt().domain(this.ts.meta.yMeta).range([5, 30]);
    this.ts.meta.xScale = scaleLinear().domain([this.ts.meta.xMeta[0], this.ts.meta.xMeta[1] + .1*(this.ts.meta.xMeta[1]-this.ts.meta.xMeta[0])]).range([2, this.ts.widthGraph - 2]);
    this.setState(this.ts)
    console.log("State Done", this.state)
  }
  refCallbackChart = element => {
    if (element) {
    this.stateUpdater({ widthGraph })
    }

  }
  refCallbackLabel = element => {
    if (element) {
      const widthLabel = element.getBoundingClientRect().width
      this.stateUpdater({ widthLabel })
    }
  };

  labelSelectorBroadcast(key) {
    const selectedLabel = (this.state.selectedLabel === null) ? key : null
    this.setState({ selectedLabel })
  }

  stateSetterLight(r) {
    console.log("r")
    this.setState({ zoom: r });
  }

  componentWillMount = () => {
    const dt = getDateString()
    //const list_dir = 'test_dir_om_2'
    const list_dir = 'gen_two'
    const defaultUrl = `https://s3.amazonaws.com/twitter-satellite/data-aws/${list_dir}/production/d3-${dt}.json`
    // const defaultUrl = `https://s3.amazonaws.com/twitter-satellite/data-aws/test_dir_om_2/production/d3-7-9-2018.json`
    fetch(defaultUrl)
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        const d_all = JSON.parse(myJson)
        const meta = makeMeta(d_all.labels, d_all.statuses)
        addTweetsToLabels(d_all.labels, d_all.statuses)
        this.stateUpdater({ statuses: d_all.statuses, labels: d_all.labels, zoom: meta.startZoom, meta })
        zoom2(meta.startZoom, this.stateSetterLight, meta.steps)
      });
  }

  render() {
    return (

      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Twitter satellite</h1>
        </header>
        <div id="zoom-frame" style={{ width: "100%", position: "absolute", left: "0px", margin: '0px', padding: '0px' }}>
          <Grid fluid>
            {/*Test Grid for sizing */}
            <Row>
              <Col xs={0} md={1} lg={1}></Col><Col xs={12} md={10} lg={9}>
                <Row style={{ height: "0px" }}>
                  <Col xs={10} md={9}><div ref={this.refCallbackLabel}> </div></Col>
                  <Col xs={2} md={3}><div ref={this.refCallbackChart}> </div></Col>
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
                    <div key={`row_${i}`}> <Tile item={this.state.labels[key]} zoom={this.state.zoom} selectedLabel={this.state.selectedLabel} broadcastSelected={this.labelSelectorBroadcast} meta={this.state.meta} widthLabel={this.state.widthLabel} widthGraph={this.state.widthGraph} /> </div>)
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