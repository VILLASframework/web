/**
 * File: new-user.js
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
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

import Dialog from './dialog';

class NewUserDialog extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  valid: false;

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      mail: '',
      role: 'admin',
      password: ''
    };
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
      username: '',
      mail: '',
      role: 'admin',
      password: ''
    });
  }

  validateForm(target) {
    // check all controls
    let username = this.state.username !== '' && this.state.username.length >= 3;
    let password = this.state.password !== '';

    this.valid =  username && password;

    // return state to control
    switch(target) {
      case 'username':
        return username ? "success" : "error";
      case 'password':
        return password ? "success" : "error";
      default:
        return "success";
    }
  }

  render() {
    return (
      <Dialog show={this.props.show} title="New user" buttonTitle="Add" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="username" validationState={this.validateForm('username')}>
            <ControlLabel>Username</ControlLabel>
            <FormControl type="text" placeholder="Enter username" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
            <HelpBlock>Min 3 characters.</HelpBlock>
          </FormGroup>
          <FormGroup controlId="mail">
            <ControlLabel>E-mail</ControlLabel>
            <FormControl type="text" placeholder="Enter e-mail" value={this.state.mail} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="password" validationState={this.validateForm('password')}>
            <ControlLabel>Password</ControlLabel>
            <FormControl type="text" placeholder="Enter password" value={this.state.password} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="role" validationState={this.validateForm('role')}>
            <ControlLabel>Role</ControlLabel>
            <FormControl componentClass="select" placeholder="Select role" value={this.state.role} onChange={(e) => this.handleChange(e)}>
              <option key='1' value='admin'>Administrator</option>
              <option key='2' value='user'>User</option>
              <option key='3' value='guest'>Guest</option>
            </FormControl>
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default NewUserDialog;
