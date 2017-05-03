/**
 * File: edit-user.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 02.05.2017
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

class EditUserDialog extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };

  valid: true;

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      mail: '',
      role: '',
      _id: ''
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
    this.setState({ [e.target.id]: e.target.value });
  }

  resetState() {
    this.setState({
      username: this.props.user.username,
      mail: this.props.user.mail,
      role: this.props.user.role,
      _id: this.props.user._id
    });
  }

  validateForm(target) {
    // check all controls
    var username = true;

    if (this.state.username === '') {
      username = false;
    }

    this.valid = username;

    // return state to control
    if (target === 'username') return username ? "success" : "error";

    return "success";
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Edit user" buttonTitle="save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="username" validationState={this.validateForm('username')}>
            <ControlLabel>Username</ControlLabel>
            <FormControl type="text" placeholder="Enter username" value={this.state.username} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="mail" validationState={this.validateForm('mail')}>
            <ControlLabel>E-mail</ControlLabel>
            <FormControl type="text" placeholder="Enter e-mail" value={this.state.mail} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="role" validationState={this.validateForm('role')}>
            <ControlLabel>Role</ControlLabel>
            <FormControl componentClass="select" placeholder="Select role" value={this.state.role} onChange={(e) => this.handleChange(e)}>
              <option key='1' value='admin'>Admin</option>
              <option key='2' disabled value='operator'>Operator</option>
            </FormControl>
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default EditUserDialog;
