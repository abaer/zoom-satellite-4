
import React from 'react';
import Dropdown from './Dropdown'

function Toolbar(props) {
  return (
    <div id="toolbar" className="toolbar">
      <div className="page_log">Zoom:
              <span id="zoom_log">{props.zoom}</span>
      </div>
      <div className="page_log" style={{marginLeft:"10px"}}> List: 
              <Dropdown listHandler={props.listHandler} />
      </div>
    </div>
  );
}

export default Toolbar