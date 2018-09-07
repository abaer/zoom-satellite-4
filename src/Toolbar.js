
import React from 'react';

function Toolbar(props) {
  return (
    <div id="toolbar" className="toolbar">
      <div className="page_log">Zoom:
              <span id="zoom_log">{props.zoom}</span>
      </div>
    </div>
  );
}

export default Toolbar