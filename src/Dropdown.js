
import React, {
    Component
  } from 'react';
  
  
  const listmappings = {
    'Alan': 'gen_two',
    'Jeff_Dean': 'test_dir_d',
    'Kaveh_Akbar': 'test_dir_akbar_2',
    'Ottolenghi': 'test_dir_ottolenghi',
    'OM': 'test_dir_om_2',
    'Mark_Jardine': 'test_dir_jardine',
    'Jack': 'dir_jack'
  }

  class Dropdown extends Component {
    constructor(props) {
      super(props)
      const lists = Object.keys(listmappings)
      const listObjs = lists.map(key => {return {name:key, dir:listmappings[key]}})
      this.state = { selected:"gen_two",  listObjs} 
    }

    render() {
      return (
        <select name="select" onChange={this.props.listHandler}>
        {this.state.listObjs.map(function(opt) { 
            return (<option key={opt.dir} value={opt.dir} >{opt.name}</option>);
        })}
      </select>
      );
    }
  }
  
  export default Dropdown