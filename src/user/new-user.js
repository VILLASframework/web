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

class NewUserDialog extends React.Component {
  valid: false;

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      mail: '',
      role: 'User',
      password: '',
    };
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
    let username = this.state.username !== '' && this.state.username.length >= 3;
    let password = this.state.password !== '';
    let role = this.state.role !== '';
    let mail = this.state.mail !== '';

    this.valid =  username && password && role && mail;
  }

  resetState() {
    this.setState({
      username: '',
      mail: '',
      role: 'User',
      password: '',
    });
  }

  render() {
    return (
      <Dialog
        show={this.props.show}
        title="New User"
        buttonTitle="Add"
        onClose={(c) => this.onClose(c)}
        onReset={() => this.resetState()}
        valid={this.valid}
      >
        <Form>
          <Form.Group as={Col} controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <Form.Control.Feedback />
            <Form.Text>Min 3 characters.</Form.Text>
          </Form.Group>
          <Form.Group as={Col} controlId="mail">
            <Form.Label>E-mail</Form.Label>
            <Form.Control type="text" placeholder="Enter e-mail" value={this.state.mail} onChange={(e) => this.handleChange(e)} />
            <Form.Control.Feedback />
          </Form.Group>
          <Form.Group as={Col} controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="text" placeholder="Enter password" value={this.state.password} onChange={(e) => this.handleChange(e)} />
            <Form.Control.Feedback />
          </Form.Group>
          <Form.Group as={Col} controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" placeholder="Select role" value={this.state.role} onChange={(e) => this.handleChange(e)}>
              <option key='1' value='Admin'>Administrator</option>
              <option key='2' value='User'>User</option>
              <option key='3' value='Guest'>Guest</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Dialog>
    );
  }
}

export default NewUserDialog;
