
import React from 'react';
import Dropdown from './Dropdown'

function Toolbar(props) {
  const stepCount = (props.meta && props.meta.step_counts && props.zoom) ? props.meta["step_counts"][props.zoom] : 0
  const stepPoints = (props.meta && props.meta.step_points && props.zoom) ? props.meta["step_points"][props.zoom] : 0
  return (
    <div id="toolbar" className="toolbar">
      <div className="page_log">Zoom:
              <span id="zoom_log">{props.zoom}</span>
      </div>
      <div className="page_log" style={{marginLeft:"20px"}}> Rows: 
        <span id="zoom_log">{stepCount}/{stepPoints}</span>
      </div>
      <div className="page_log" style={{marginLeft:"25px"}}> List: 
              <Dropdown listHandler={props.listHandler} list={props.list} />
      </div>
    </div>
  );
}

export default Toolbar