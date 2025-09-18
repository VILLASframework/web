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

import Dialog from '../../../common/dialogs/dialog';

class ImportConfigDialog extends React.Component {
  imported = false;
  valid = false;

  constructor(props) {
    super(props);

    this.state = {
      config: {},
      name: '',
    };
  }

  onClose(canceled){
    if (canceled) {
      this.props.onClose();

      return;
    }

    this.props.onClose(this.state);
  }

  resetState = () => {
    this.setState({
      config: {},
      name: ''
    });

    this.imported = false;
  }

  loadFile = event => {
    // get file
    const file = event.target.files[0];
    if (!file.type.match('application/json')) {
      return;
    }

    // create file reader
    let reader = new FileReader();
    let self = this;

    reader.onload = event => {
      const config = JSON.parse(event.target.result);

      self.imported = true;
      self.valid = true;
      this.setState({name: config.name, config: config });
    };

    reader.readAsText(file);
  }

  handleChange(e, index) {
    this.setState({ [e.target.id]: e.target.value });
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
        title="Import Component Configuration"
        buttonTitle="Import"
        onClose={(c) => this.onClose(c)}
        onReset={() => this.resetState()}
        valid={this.valid} >
        <Form>
          <Form.Group controlId='file' style={{marginBottom: '15px'}}>
            <Form.Label>Component Configuration File</Form.Label>
            <Form.Control type='file' onChange={this.loadFile} />
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

export default ImportConfigDialog;
