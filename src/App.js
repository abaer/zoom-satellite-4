import React, { Component } from 'react';
import './App.css';
import Tile from './Tile'
import Toolbar from './Toolbar'
import { getDateString } from './utils.js'
import { zoom2 } from './zoom.js'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { scaleLinear, scaleSqrt } from "d3-scale";
import { getInitialZoom } from './data';

function makeS3Url(listDir, date = "today"){
  const dt = (date === "today") ? getDateString() : date
  const listUrl = `https://s3.amazonaws.com/twitter-satellite/data-aws/${listDir}/production/d3-${dt}-label_format.json`
  // const listUrl = `https://s3.amazonaws.com/twitter-satellite/data-aws/${listDir}/production/d3-${dt}.json`
  return listUrl
}
class App extends Component {
  constructor(props) {
    super(props);
    this.stateSetterLight = this.stateSetterLight.bind(this);
    this.listHandler = this.listHandler.bind(this);
    this.labelSelectorBroadcast = this.labelSelectorBroadcast.bind(this);
    this.state = { labelArray: [], zoom: 2, selectedLabel: null, widthLabel: 0, widthGraph: 0 ,previousSelected:null, list:"gen_two"};
    this.ts = {}
  }
  
  handleData(ts){
    const widthGraph = (ts.widthGraph !== undefined) ? ts.widthGraph : this.state.widthGraph
    const labels = JSON.parse(ts.json)
    const meta = labels["meta_data"]
    meta.startZoom = getInitialZoom(meta.step_counts, meta.steps)
    //Set up scale functions for sparkles
    meta.yScale = scaleSqrt().domain(meta.yMeta).range([5, 30]);
    meta.xScale = scaleLinear().domain([meta.xMeta[0], meta.xMeta[1] + .1 * (meta.xMeta[1] - meta.xMeta[0])]).range([2, widthGraph - 2]);
    if(ts.json !== undefined){
      delete ts.json
    }
    this.setState({...ts, zoom: meta.startZoom, meta, labelArray:labels.label_data })
    console.log(this.state)
    zoom2(this.state.zoomElement, meta.startZoom, this.stateSetterLight, meta.steps)
  }

  listHandler(e){
      const listDir = e.target.value
      const listUrl = makeS3Url(listDir)
      fetch(listUrl)
        .then(response => {
          return response.json();
        })
        .then(myJson => {
          let ts = {list:listDir, json:myJson}
          this.handleData(ts)
        });
  }

  stateUpdater(update) {
    this.ts = { ...this.ts, ...update }
    const keys = new Set(Object.keys(this.ts))
    const needKeys = ["widthLabel", "widthGraph", "json"]
    for (const k of needKeys) {
      if (!keys.has(k)) {
        return
      }  
    }
    console.log("State Done", this.ts)
    this.handleData(this.ts)
  }

  labelSelectorBroadcast(key) {
    const previousSelected = this.state.selectedLabel
    const selectedLabel = (this.state.selectedLabel === null) ? key : null
    this.setState({ selectedLabel, previousSelected})
  }

  stateSetterLight(r) {
    console.log("r")
    this.setState({ zoom: r });
  }

  refCallbackChart = element => {
    if (element) {
      const widthGraph = element.getBoundingClientRect().width
      this.stateUpdater({ widthGraph })
    }

  }
  refCallbackLabel = element => {
    if (element) {
      const widthLabel = element.getBoundingClientRect().width
      this.stateUpdater({ widthLabel })
    }
  };

  refCallbackZoom = element => {
    if (element) {
      this.setState({zoomElement:element})
    }
  }

  componentDidMount = () => {
    //const list_dir = 'test_dir_om_2'
    const defaultUrl = makeS3Url(this.state.list)
    fetch(defaultUrl)
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.stateUpdater({json})
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Twitter satellite</h1>
        </header>
        <div id="zoom-frame" className="zoom-frame" ref={this.refCallbackZoom}>
          <Grid fluid>
            {/*Test Grid for sizing */}

            <Row>
              <Col xs={0} md={1} lg={1}></Col>
              <Col xs={12} md={10} lg={9}>
                <Row style={{ height: "0px" }}>
                  <Col xs={10} md={8}><div ref={this.refCallbackLabel}> </div></Col>
                  <Col xs={2} md={4}><div ref={this.refCallbackChart}> </div></Col>
                </Row>
              </Col>
            </Row>
            {/*Test Grid for sizing */}

            <Row>
              <Col xs={0} md={1} lg={1}><Row> </Row></Col>
              <Col xs={12} md={10} lg={9}>
                <Row>
                  <Col xs={12}>
                    <Toolbar zoom={this.state.zoom} listHandler={this.listHandler}/>
                  </Col>
                </Row>
                {this.state.labelArray.map((item, i) => {
                  const myKey = item.key
                  const openState = (myKey === this.state.selectedLabel) ? "opening" : ((myKey === this.state.previousSelected) ? "closing" : null)

                  return (
                    <div key={`l_${this.state.list}_r_${i}`}> <Tile item={item} zoom={this.state.zoom} broadcastSelected={this.labelSelectorBroadcast} meta={this.state.meta} widthLabel={this.state.widthLabel} widthGraph={this.state.widthGraph} openState={openState} /> </div>)
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