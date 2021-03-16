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

import Dialog from '../common/dialogs/dialog';

class ImportDashboardDialog extends React.Component {
  valid = false;
  imported = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      widgets: [],
      grid: 0
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      this.props.onClose(this.state);
    } else {
      this.props.onClose();
    }
  }

  handleChange(e, index) {
    this.setState({ [e.target.id]: e.target.value });
  }

  resetState() {
    this.setState({ name: '', widgets: [], grid: 0 });

    this.imported = false;
  }

  loadFile(fileList) {
    // get file
    const file = fileList[0];
    if (!file.type.match('application/json')) {
      return;
    }

    // create file reader
    var reader = new FileReader();
    var self = this;

    reader.onload = function(event) {
      // read IC
      const dashboard = JSON.parse(event.target.result);

      self.imported = true;
      self.valid = true;
      self.setState({ name: dashboard.name, widgets: dashboard.widgets, grid: dashboard.grid });
    };

    reader.readAsText(file);
  }

  validateForm(target) {
    // check all controls
    let name = true;

    if (this.state.name === '') {
      name = false;
    }

    this.valid =  name;

    // return state to control
    if (target === 'name'){
      return name;
    }
  }

  render() {
    return (
      <Dialog
        show={this.props.show}
        title="Import Dashboard"
        buttonTitle="Import"
        onClose={(c) => this.onClose(c)}
        onReset={() => this.resetState()}
        valid={this.valid}>
        <Form>
          <Form.Group controlId="file">
            <Form.Label>Dashboard File</Form.Label>
            <Form.Control type="file" onChange={(e) => this.loadFile(e.target.files)} />
          </Form.Group>

          <Form.Group controlId="name" >
            <Form.Label>Name</Form.Label>
            <Form.Control
              readOnly={!this.imported}
              isValid={this.validateForm('name')}
              type="text"
              placeholder="Enter name"
              value={this.state.name}
              onChange={(e) => this.handleChange(e)}
            />
            <Form.Control.Feedback />
          </Form.Group>
        </Form>
      </Dialog>
    );
  }
}

export default ImportDashboardDialog;
