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
import Dialog from '../../../common/dialogs/dialog';
import NotificationsDataManager from "../../../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../../../common/data-managers/notifications-factory";

class EditUserDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      mail: '',
      role: '',
      active: '',
      password: "",
      confirmPassword: "",
      oldPassword: "",
    }
  }

  onClose(canceled) {
    if (canceled === false) {

      let user = {}
      user.id = this.props.user.id;

      if (this.state.username != null && this.state.username !== this.props.user.username){
        user.username = this.state.username
      }

      if (this.state.mail != null && this.state.mail !== this.props.user.mail){
        user.mail = this.state.mail
      }

      if (this.state.role != null && this.state.role !== this.props.user.role){
        user.role = this.state.role
      }

      if (this.state.active != null && this.state.active !== this.props.user.active){
        user.active = this.state.active
      }

      if (this.state.password !== '' && this.state.oldPassword !== '' && this.state.password === this.state.confirmPassword) {
        user.password = this.state.password;
        user.oldpassword = this.state.oldPassword
      } else if (this.state.password !== '' && this.state.password !== this.state.confirmPassword){
        NotificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR("New password not correctly confirmed"))
      }

      this.props.onClose(user);

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
      password: "",
      confirmPassword: "",
      oldPassword: "",
    });
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Edit user" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={true}>
        <Form>
          <Form.Group as={Col} controlId="username" style={{marginBottom: '15px'}}>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder={this.props.user.username} value={this.state.username} onChange={(e) => this.handleChange(e)} />
            <Form.Control.Feedback />
          </Form.Group>
          <Form.Group as={Col} controlId="mail" style={{marginBottom: '15px'}}>
            <Form.Label>E-mail</Form.Label>
            <Form.Control type="text" placeholder={this.props.user.mail} value={this.state.mail} onChange={(e) => this.handleChange(e)} />
          </Form.Group>
          <Form.Group  as={Col} controlId="oldPassword" style={{marginBottom: '15px'}}>
            <Form.Label>Admin Password</Form.Label>
            <Form.Control type="password" placeholder="Enter admin password" value={this.state.oldPassword} onChange={(e) => this.handleChange(e)} />
          </Form.Group>
          <Form.Group as={Col} controlId="password" style={{marginBottom: '15px'}}>
            <Form.Label>New User Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={this.state.password} onChange={(e) => this.handleChange(e)} />
          </Form.Group>
          <Form.Group as={Col} controlId="confirmPassword" style={{marginBottom: '15px'}}>
            <Form.Label>Confirm new Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={this.state.confirmPassword} onChange={(e) => this.handleChange(e)} />
          </Form.Group>
          <Form.Group as={Col} controlId="role" style={{marginBottom: '15px'}}>
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" placeholder={this.props.user.role} value={this.state.role} onChange={(e) => this.handleChange(e)}>
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
