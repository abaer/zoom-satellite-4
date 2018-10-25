import React from 'react';

function Dropdown(props) {
  const lists = props.mappings
  return (
    <span>
    <select name="select" value={props.list} onChange={props.listHandler}>
      {lists.map(name => {
        if(name === props.list){
          return (<option key={name} value={name}>{name} &#x25BF;</option>);
        } else {
          return (<option key={name} value={name}>{name}</option>);
        }
      })}
    </select>
    </span>
  );
}

export default Dropdown