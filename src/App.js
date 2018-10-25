import React, { Component } from 'react';
import './App.css';
import Tile from './Tile'
import Toolbar from './Toolbar'
import { getDateString, updateUrlBox } from './utils.js'
import { zoom2 } from './zoom.js'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { scaleLinear, scaleSqrt } from "d3-scale";
import { getInitialZoom } from './data';
import { listmappings } from './settings'


function makeS3Url(listDir, date = "today") {
  const dt = (date === "today") ? getDateString() : date
  // const listUrl = `https://s3.amazonaws.com/twitter-satellite/data-aws/shared_data/production/${dt}/${listDir}.json`
  const listUrl = `http://d1x6n6m1jfvyc3.cloudfront.net/${dt}/${listDir}.json`
  // const listUrl = `https://s3.amazonaws.com/twitter-satellite/data-aws/${listDir}/production/d3-${dt}-label_format.json`
  return listUrl
}
class App extends Component {
  constructor(props) {
    super(props);
    this.stateSetterZoom = this.stateSetterZoom.bind(this);
    this.listHandler = this.listHandler.bind(this);
    this.labelSelectorBroadcast = this.labelSelectorBroadcast.bind(this);
    this.state = { labelArray: [], zoom: 2, selectedLabel: null, widthLabel: 0, widthGraph: 0, previousSelected: null, listDir: "abbaer", meta: null }
    this.ts = {}
  }

  getListFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    const listName = urlParams.get('list')
    if (listName === undefined || listName === null) {
      return this.state.listDir
    }
    // const listNameLower = listName.toLowerCase()
    console.log(listName)
    if (listmappings.includes(listName) === false) {
      return this.state.listDir
    } else {
      this.setState({ listDir: listName })
      return listName;
    }
  }

  handleData(ts) {
    const widthGraph = (ts.widthGraph !== undefined) ? ts.widthGraph : this.state.widthGraph
    const labels = JSON.parse(ts.json)
    // const sortedLabelData = labels.label_data.sort((a, b) => b.tweet_data[0].date - a.tweet_data[0].date)
    const meta = labels["meta_data"]
    meta.startZoom = getInitialZoom(meta.step_counts, meta.steps)
    //Set up scale functions for sparkles
    meta.yScale = scaleSqrt().domain(meta.yMeta).range([5, 30]);
    meta.xScale = scaleLinear().domain([meta.xMeta[0], meta.xMeta[1] + .1 * (meta.xMeta[1] - meta.xMeta[0])]).range([2, widthGraph - 2]);
    if (ts.json !== undefined) {
      delete ts.json
    }
    this.setState({ ...ts, zoom: meta.startZoom, meta, labelArray: labels.label_data })
    console.log(this.state)
    zoom2(this.state.zoomElement, meta.startZoom, this.stateSetterZoom, meta.steps)
  }

  listHandler(e) {
    const name = e.target.value
    updateUrlBox(name)
    const listUrl = makeS3Url(name)
    fetch(listUrl)
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        const previousSelected = this.state.selectedLabel
        let ts = { listDir: name, json: myJson, selectedLabel: null, previousSelected }
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
    this.setState({ selectedLabel, previousSelected })
  }

  stateSetterZoom(r) {
    console.log("r")
    // this.setState({ selectedLabel:null, previousSelected:null })
    const previousSelected = this.state.selectedLabel
    this.setState({ zoom: r, selectedLabel: null, previousSelected });
  }

  refCallbackChart = element => {
    if (element) {
      const widthGraph = element.getBoundingClientRect().width + 6
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
      this.setState({ zoomElement: element })
    }
  }

  componentDidMount = () => {
    //const list_dir = 'test_dir_om_2'
    const listDir = this.getListFromUrl()
    const defaultUrl = makeS3Url(listDir)
    fetch(defaultUrl)
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.stateUpdater({ json })
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Twitter satellite</h1>
        </header>
        <div id="zoom-frame" className="zoom-frame" style={{zIndex:10}} ref={this.refCallbackZoom}>
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
                    <Toolbar zoom={this.state.zoom} listHandler={this.listHandler} meta={this.state.meta} list={this.state.listDir} mappings={listmappings} />
                  </Col>
                </Row>
                {this.state.labelArray.map((item, i) => {
                  const myKey = item.key
                  const openState = (myKey === this.state.selectedLabel) ? "opening" : ((myKey === this.state.previousSelected) ? "closing" : null)
                  return (
                    <div key={`l_${this.state.listDir}_r_${i}`}> <Tile item={item} zoom={this.state.zoom} broadcastSelected={this.labelSelectorBroadcast} meta={this.state.meta} widthLabel={this.state.widthLabel} widthGraph={this.state.widthGraph} openState={openState} list={this.state.listDir} /> </div>)
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