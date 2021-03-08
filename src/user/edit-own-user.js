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


class EditOwnUserDialog extends React.Component {
  valid: true;

  constructor(props) {
    super(props);

    this.state = {
      username: this.props.user.username,
      id: this.props.user.id,
      mail: this.props.user.mail,
      password: '',
      oldPassword: '',
      confirmPassword: ''
    }
  }

  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        this.props.onClose(this.state);
      }
    } else {
      this.props.onClose();
    }
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });

    // check all controls
    let username = true;
    let mail = true;
    let pw = true;
    let oldPassword = true;
    let confirmPassword = true;

    if (this.state.username === '') {
      username = false;
    }

    if (this.state.mail === '') {
      mail = false;
    }

    if (this.state.password === '') {
      pw = false;
    }

    if (this.state.oldPassword === '') {
      oldPassword = false;
    }

    if (this.state.confirmPassword === '') {
      confirmPassword = false;
    }

    // form is valid if the following condition is met
    this.valid = username || mail || (oldPassword && pw && confirmPassword);
  }

  resetState() {
    this.setState({
      username: this.props.user.username,
      id: this.props.user.id,
      mail: this.props.user.mail,
      oldPassword: '',
      confirmPassword: '',
      password: '',
    });
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Edit user" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <Form>
          <Form.Group as={Col} controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={this.state.username} onChange={(e) => this.handleChange(e)} autocomplete="username" />
            <Form.Control.Feedback />
          </Form.Group>
          <Form.Group as={Col} controlId="mail">
            <Form.Label>E-mail</Form.Label>
            <Form.Control type="text" value={this.state.mail} onChange={(e) => this.handleChange(e)} autocomplete="email" />
          </Form.Group>
          <Form.Group  as={Col} controlId="oldPassword">
            <Form.Label>Old Password</Form.Label>
            <Form.Control type="password" placeholder="Enter current password" value={this.state.oldPassword} onChange={(e) => this.handleChange(e)} autocomplete="current-password" />
          </Form.Group>
          <Form.Group as={Col} controlId="password">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" placeholder="Enter new password" value={this.state.password} onChange={(e) => this.handleChange(e)} autocomplete="new-password" />
          </Form.Group>
          <Form.Group as={Col} controlId="confirmPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control type="password" placeholder="Repeat new password" value={this.state.confirmPassword} onChange={(e) => this.handleChange(e)} autocomplete="new-password" />
          </Form.Group>
        </Form>
      </Dialog>
    );
  }
}

export default EditOwnUserDialog;
