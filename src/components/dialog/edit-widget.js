/**
 * File: edit-widget.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 08.03.2017
 *
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

import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import Dialog from './dialog';

import createControls from './edit-widget-control-creator';

class EditWidgetDialog extends Component {
  static propTypes = {
    sessionToken: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  valid: true;

  constructor(props) {
    super(props);

    this.state = {
      temporal: {
        name: '',
        simulator: '',
        signal: 0
      }
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      this.props.onClose(this.state.temporal);
    } else {
      this.props.onClose();
    }
  }

  handleChange(e) {
    if (e.constructor === Array) {
      // Every property in the array will be updated
      let changes = e.reduce( (changesObject, event) => { changesObject[event.target.id] = event.target.value; return changesObject }, {});
      this.setState({ temporal: Object.assign({}, this.state.temporal, changes ) });
    } else {
        let changeObject = {};
        changeObject[e.target.id] = e.target.value;
        this.setState({ temporal: Object.assign({}, this.state.temporal, changeObject ) });
    }
  }

  resetState() {
    var widget_data = Object.assign({}, this.props.widget);
    this.setState({ temporal: widget_data });
  }

  validateForm(target) {
    // check all controls
    var name = true;

    if (this.state.name === '') {
      name = false;
    }

    this.valid = name;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
  }

  render() {
    
    let controls = null;
    if (this.props.widget) {
      controls = createControls(
            this.props.widget.type,
            this.state.temporal,
            this.props.sessionToken,
            this.props.files,
            (id) => this.validateForm(id),
            this.props.simulation,
            (e) => this.handleChange(e));
    }

    return (
      <Dialog show={this.props.show} title="Edit Widget" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form encType='multipart/form-data'>
          <FormGroup controlId="name" validationState={this.validateForm('name')}>
            <ControlLabel>Name</ControlLabel>
            <FormControl type="text" placeholder="Enter name" value={this.state.temporal.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          { controls || '' }
        </form>
      </Dialog>
    );
  }
}

export default EditWidgetDialog;
