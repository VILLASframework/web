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
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import _ from 'lodash';

import Dialog from '../common/dialogs/dialog';

class ImportICDialog extends React.Component {
  valid = false;
  imported = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      websocketurl: '',
      uuid: ''
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        const data = {
          properties: {
            name: this.state.name
          },
          uuid: this.state.uuid
        };

        if (this.state.websocketurl != null && this.state.websocketurl !== "" && this.state.websocketurl !== 'http://') {
          data.websocketurl = this.state.websocketurl;
        }

        this.props.onClose(data);
      }
    } else {
      this.props.onClose();
    }
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  resetState() {
    this.setState({ name: '', websocketurl: 'http://', uuid: '' });
  }

  loadFile(fileList) {
    // get file
    const file = fileList[0];
    if (!file.type.match('application/json')) {
      return;
    }

    // create file reader
    const reader = new FileReader();
    const self = this;

    reader.onload = function(event) {
      // read component
      const ic = JSON.parse(event.target.result);
      self.imported = true;
      self.setState({
        name: _.get(ic, 'properties.name') || _.get(ic, 'rawProperties.name'),
        websocketurl: _.get(ic, 'websocketurl'),
        uuid: ic.uuid
      });
    };

    reader.readAsText(file);
  }

  validateForm(target) {
    // check all controls
    let name = true;
    let uuid = true;

    if (this.state.name === '') {
      name = false;
    }

    if (this.state.uuid === '') {
      uuid = false;
    }

    this.valid = name || uuid;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    if (target === 'uuid') return uuid ? "success" : "error";
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Import Infrastructure Component" buttonTitle="Add" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="file">
            <FormLabel>Infrastructure Component File</FormLabel>
            <FormControl type="file" onChange={(e) => this.loadFile(e.target.files)} />
          </FormGroup>

          <FormGroup controlId="name" valid={this.validateForm('name')}>
            <FormLabel>Name</FormLabel>
            <FormControl type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="websocketurl">
            <FormLabel>Websocket URL</FormLabel>
            <FormControl type="text" placeholder="Enter websocketurl" value={this.state.websocketurl} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="uuid" valid={this.validateForm('uuid')}>
            <FormLabel>UUID</FormLabel>
            <FormControl type="text" placeholder="Enter uuid" value={this.state.uuid} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default ImportICDialog;
