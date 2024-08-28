/**
 * This file is part of VILLASweb.
 *
 * VILLASweb is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * VILLASweb is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with VILLASweb. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

import React from 'react';
import { Form } from 'react-bootstrap';

class EditWidgetConfigSelect extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configs: [],
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      configs: props.configs
    };
  }

  handleConfigChange(e) {
    let value = e.target.value === "Select config" ? (-1) : (e.target.value);
    this.props.handleChange({ target: { id: this.props.controlId, value: value } });
  }

  render() {

    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if(parts.length === 1){
      isCustomProperty = false;
    }

    let configOptions = [];
    if (this.state.configs !== null && this.state.configs.length > 0){
      configOptions.push(
        <option key = {0} default>Select config</option>
        )
        configOptions.push(this.state.configs.map((cfg, index) => (
        <option key={index+1} value={cfg.id}>{cfg.name}</option>
      )))
    } else {
      configOptions = <option style={{ display: 'none' }}>No configs found</option>
    }

    return <div style={this.props.style}>
      <Form.Group controlId="ic">
        <Form.Label>Component Configuration</Form.Label>
        <Form.Control
          as="select"
          value={isCustomProperty ? this.props.widget[parts[0]][parts[1]] : this.props.widget[this.props.controlId]}
          onChange={(e) => this.handleConfigChange(e)}>{configOptions} </Form.Control>
      </Form.Group>
    </div>;
  }
}

export default EditWidgetConfigSelect;
