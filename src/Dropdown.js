
import React from 'react';

function Dropdown(props) {
  const lists = Object.keys(props.mappings)
  return (
    <span>
    <select name="select" value={props.list} onChange={props.listHandler}>
      {lists.map(name => {
        const val = props.mappings[name]
        if(val === props.list){
          return (<option key={val} value={val} >{name} &#x25BF;</option>);
        } else {
          return (<option key={val} value={val} >{name}</option>);
        }
        
      })}
    </select>
    </span>
  );
}

export default Dropdown