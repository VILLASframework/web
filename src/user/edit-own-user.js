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
import {FormGroup, FormControl, FormLabel, Col} from 'react-bootstrap';

import Dialog from '../common/dialogs/dialog';


class EditOwnUserDialog extends React.Component {
  valid: true;

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      id: '',
      mail: '',
      password: '',
      oldPassword: '',
      confirmpassword: ''
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
    this.valid = username || mail || (oldPassword &&  pw && confirmPassword);
  }

  resetState() {
    this.setState({
      username: '',
      mail: '',
      oldPassword: '',
      confirmPassword: '',
      password: '',
      id: this.props.user.id,
    });
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Edit user" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup as={Col} controlId="username">
            <FormLabel>Username</FormLabel>
            <FormControl type="text" placeholder={this.props.user.username} value={this.state.username} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup as={Col} controlId="mail">
            <FormLabel>E-mail</FormLabel>
            <FormControl type="text" placeholder={this.props.user.mail} value={this.state.mail} onChange={(e) => this.handleChange(e)} />
          </FormGroup>
          <FormGroup  as={Col} controlId="oldPassword">
            <FormLabel>Old Password</FormLabel>
            <FormControl type="password" placeholder="Enter current password" value={this.state.oldPassword} onChange={(e) => this.handleChange(e)} />
          </FormGroup>

          <FormGroup as={Col} controlId="password">
            <FormLabel>New Password</FormLabel>
            <FormControl type="password" placeholder="Enter password" value={this.state.password} onChange={(e) => this.handleChange(e)} />
          </FormGroup>

          <FormGroup as={Col} controlId="confirmpassword">
            <FormLabel>Confirm New Password</FormLabel>
            <FormControl type="password" placeholder="Enter password" value={this.state.confirmpassword} onChange={(e) => this.handleChange(e)} />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default EditOwnUserDialog;
