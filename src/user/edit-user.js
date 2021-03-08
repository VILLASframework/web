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

class EditUserDialog extends React.Component {
  valid: true;

  constructor(props) {
    super(props);

    this.state = {
      username: props.user.username,
      mail: props.user.mail,
      role: props.user.role,
      id: props.user.id,
      active: props.user.active,
      password: '',
      confirmPassword: '',
      oldPassword: ''
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
    var username = true;
    var role = true;
    var mail = true;
    var pw = true;
    var active = true;
    var confirmPassword = true;
    var oldPassword = true;

    if (this.state.username === '') {
      username = false;
    }

    if (this.state.role === ''){
      role = false;
    }

    if (this.state.mail === '') {
      mail = false;
    }

    if (this.state.password === '') {
      pw = false;
    }

    if (this.state.active === '') {
      active = false;
    }

    if (this.state.confirmPassword === '') {
      confirmPassword = false;
    }

    if (this.state.oldPassword === '') {
      oldPassword = false;
    }

    // form is valid if any of the fields contain somethig
    this.valid = username || role || mail || pw || active || confirmPassword || oldPassword;
  }

  resetState() {
    this.setState({
      username: this.props.user.username,
      mail: this.props.user.mail,
      role: this.props.user.role,
      id: this.props.user.id
    });
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Edit user" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <Form>
          <Form.Group as={Col} controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={this.state.username} onChange={(e) => this.handleChange(e)} />
            <Form.Control.Feedback />
          </Form.Group>
          <Form.Group as={Col} controlId="mail">
            <Form.Label>E-mail</Form.Label>
            <Form.Control type="text" value={this.state.mail} onChange={(e) => this.handleChange(e)} />
          </Form.Group>
          <Form.Group  as={Col} controlId="oldPassword">
            <Form.Label>Admin Password</Form.Label>
            <Form.Control type="password" placeholder="Enter admin password" value={this.state.oldPassword} onChange={(e) => this.handleChange(e)} />
          </Form.Group>
          <Form.Group as={Col} controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={this.state.password} onChange={(e) => this.handleChange(e)} />
          </Form.Group>
          <Form.Group as={Col} controlId="confirmPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={this.state.confirmPassword} onChange={(e) => this.handleChange(e)} />
          </Form.Group>
          <Form.Group as={Col} controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" placeholder="Select role" value={this.state.role} onChange={(e) => this.handleChange(e)}>
              <option key='1' value='Admin'>Administrator</option>
              <option key='2' value='User'>User</option>
              <option key='3' value='Guest'>Guest</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="active">
            <Form.Label>Active</Form.Label>
            <Form.Control as="select" placeholder="Select Active state" value={this.state.active} onChange={(e) => this.handleChange(e)}>
              <option key='1' value='yes'>Yes</option>
              <option key='2' value='no'>No</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Dialog>
    );
  }
}

export default EditUserDialog;
