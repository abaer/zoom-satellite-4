
import React from 'react';

function Dropdown(props) {
  const lists = Object.keys(props.mappings)
  return (
    <select name="select" value={props.list} onChange={props.listHandler}>
      {lists.map(name => {
        const val = props.mappings[name]
        return (<option key={val} value={val} >{name}</option>);
      })}
    </select>
  );
}

export default Dropdown