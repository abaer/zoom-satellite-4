import React, { Component } from 'react';
import './App.css';
import Tile from './Tile'
import Toolbar from './Toolbar'
import { getDateString } from './utils.js'
import { zoom2 } from './zoom.js'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { addTweetsToLabels, makeMeta } from './data';
import { scaleLinear, scaleSqrt } from "d3-scale";

class App extends Component {
  constructor(props) {
    super(props);
    this.stateSetterLight = this.stateSetterLight.bind(this);
    this.listHandler = this.listHandler.bind(this);
    this.labelSelectorBroadcast = this.labelSelectorBroadcast.bind(this);
    this.state = { labels: {}, zoom: 2, selectedLabel: null, widthLabel: 0, widthGraph: 0 ,previousSelected:null};
    this.ts = {}
  }

  listHandler(e){
      this.setState({selected:e.target.value});
      console.log(e.target.value)
      const dt = getDateString()
      //const list_dir = 'test_dir_om_2'
      const list_dir = e.target.value
      const listUrl = `https://s3.amazonaws.com/twitter-satellite/data-aws/${list_dir}/production/d3-${dt}.json`
      // const defaultUrl = `https://s3.amazonaws.com/twitter-satellite/data-aws/test_dir_om_2/production/d3-7-9-2018.json`
      fetch(listUrl)
        .then(response => {
          return response.json();
        })
        .then(myJson => {
          const d_all = JSON.parse(myJson)
          const meta = makeMeta(d_all.labels, d_all.statuses)
          addTweetsToLabels(d_all.labels, d_all.statuses)
          meta.yScale = scaleSqrt().domain(meta.yMeta).range([5, 30]);
          meta.xScale = scaleLinear().domain([meta.xMeta[0], meta.xMeta[1] + .1 * (meta.xMeta[1] - meta.xMeta[0])]).range([2, this.state.widthGraph - 2]);
          meta.list = list_dir
          this.setState({ labels: d_all.labels, zoom: meta.startZoom, meta })
          console.log(this.state)
          // this.stateUpdater({ labels: d_all.labels, zoom: meta.startZoom, meta })
        });
  }

  stateUpdater(update) {
    this.ts = { ...this.ts, ...update }
    const keys = new Set(Object.keys(this.ts))
    const needKeys = ["widthLabel", "widthGraph", "labels", "meta"]
    for (const k of needKeys) {
      if (!keys.has(k)) {
        return
      }  
    }
    //Set up range functions once and pass to Sparkles
    this.ts.meta.yScale = scaleSqrt().domain(this.ts.meta.yMeta).range([5, 30]);
    this.ts.meta.xScale = scaleLinear().domain([this.ts.meta.xMeta[0], this.ts.meta.xMeta[1] + .1 * (this.ts.meta.xMeta[1] - this.ts.meta.xMeta[0])]).range([2, this.ts.widthGraph - 2]);
    this.ts.meta.list = "default"
    this.setState(this.ts)
    zoom2(this.state.zoomElement, this.ts.meta.startZoom, this.stateSetterLight, this.ts.meta.steps)
    // z oom2(this.ts.meta.startZoom, this.stateSetterLight, this.ts.meta.steps)
    console.log("State Done", this.state)
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
        this.stateUpdater({ labels: d_all.labels, zoom: meta.startZoom, meta })
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
              <Col xs={0} md={1} lg={1}></Col><Col xs={12} md={10} lg={9}>
                <Row style={{ height: "0px" }}>
                  <Col xs={10} md={9}><div ref={this.refCallbackLabel}> </div></Col>
                  <Col xs={2} md={3}><div ref={this.refCallbackChart}> </div></Col>
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
                {Object.keys(this.state.labels).map((key, i) => {
                  return (
                    <div key={`l_${this.state.meta.list}_r_${i}`}> <Tile item={this.state.labels[key]} zoom={this.state.zoom} selectedLabel={this.state.selectedLabel} previousSelected={this.state.previousSelected} broadcastSelected={this.labelSelectorBroadcast} meta={this.state.meta} widthLabel={this.state.widthLabel} widthGraph={this.state.widthGraph} /> </div>)
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