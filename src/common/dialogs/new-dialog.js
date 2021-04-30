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

import Dialog from './dialog';

class NewDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    }
  }

  onClose(canceled) {
    if (canceled === false) {
      this.props.onClose(this.state);
    } else {
      this.props.onClose();
    }
  }

  handleChange(e) {
    console.log(e)

    this.setState({ [e.target.id]: e.target.value });
  }

  resetState() {
    this.setState({ value: '' });
  }

  validateForm(target) {
    // check all controls
    var inputGiven = true;

    if (this.state.value === '') {
      inputGiven = false;
    }

    this.valid = inputGiven;

    // return state to control
    if (target === 'value') return inputGiven ? "success" : "error";

    return "success";
  }

  render() {
    return (
      <Dialog
        size="md"
        show={this.props.show}
        title={this.props.title}
        buttonTitle="Add"
        onClose={(c) => this.onClose(c)}
        onReset={() => this.resetState()}
        valid={this.valid}
      >
        <Form>
          <Form.Group controlId="value" valid={this.validateForm('value')}>
            <Form.Label>{this.props.inputLabel}</Form.Label>
            <Form.Control type="text" placeholder={this.props.placeholder} value={this.state.value} onChange={(e) => this.handleChange(e)} />
            <Form.Control.Feedback />
          </Form.Group>
        </Form>
      </Dialog>
    );
  }
}

export default NewDialog;
