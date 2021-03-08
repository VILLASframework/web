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
import { Form, Col } from 'react-bootstrap';

import Dialog from '../common/dialogs/dialog';
import ParametersEditor from '../common/parameters-editor';

class EditScenarioDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      id: '',
      running: false,
      startParameters: {}
    };
  }

  onClose = canceled => {
    if (canceled) {
      if (this.props.onClose != null) {
        this.props.onClose();
      }

      return;
    }

    if (this.valid && this.props.onClose != null) {
      this.props.onClose(this.state);
    }
  };

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });

    let name = true;

    if (this.state.name === '') {
      name = false;
    }

    this.valid = name;

  };

  resetState = () => {
    this.setState({
      name: this.props.scenario.name,
      id: this.props.scenario.id,
      running: this.props.scenario.running,
      startParameters: this.props.scenario.startParameters || {}
    });
  };

  handleStartParametersChange = startParameters => {
    this.setState({ startParameters });
  };

  render() {
    return <Dialog
      show={this.props.show}
      title='Edit Scenario'
      buttonTitle='Save'
      onClose={this.onClose}
      onReset={this.resetState}
      valid={true}
    >
      <Form>
        <Form.Group as={Col} controlId='name'>
          <Form.Label column={false}>Name</Form.Label>
          <Form.Control type='text' placeholder='Enter name' value={this.state.name} onChange={this.handleChange} />
          <Form.Control.Feedback />
        </Form.Group>

        <Form.Group as={Col} controlId='startParameters'>
          <Form.Label column={false}>Start Parameters</Form.Label>
          <ParametersEditor content={this.state.startParameters} onChange={this.handleStartParametersChange} />
        </Form.Group>
      </Form>
    </Dialog>;
  }
}

export default EditScenarioDialog;
