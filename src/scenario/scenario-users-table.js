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

import React, {Component} from "react";
import { Form, InputGroup} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import Table from "../common/table";
import TableColumn from "../common/table-column";
import IconButton from "../common/buttons/icon-button";
import DeleteDialog from "../common/dialogs/delete-dialog";
import AppDispatcher from "../common/app-dispatcher";

class ScenarioUsersTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userToAdd: '',
      deleteUserName: '',
      deleteUserModal: false,
      goToScenarios: false
    }
  }

  onUserInputChange(e) {
    this.setState({ userToAdd: e.target.value });
  }

  addUser() {
    AppDispatcher.dispatch({
      type: 'scenarios/add-user',
      data: this.props.scenario.id,
      username: this.state.userToAdd,
      token: this.props.sessionToken
    });

    this.setState({ userToAdd: '' });
  }

  closeDeleteUserModal() {
    let scenarioID = this.props.scenario.id;
    if (this.state.deleteUserName === this.props.currentUser.username) {
      AppDispatcher.dispatch({
        type: 'scenarios/remove-user',
        data: scenarioID,
        username: this.state.deleteUserName,
        token: this.props.sessionToken,
        ownuser: true
      });
      this.setState({ goToScenarios: true });
    } else {
      AppDispatcher.dispatch({
        type: 'scenarios/remove-user',
        data: scenarioID,
        username: this.state.deleteUserName,
        token: this.props.sessionToken,
        ownuser: false
      });
    }
    this.setState({ deleteUserModal: false });
  }


  render() {

    if (this.state.goToScenarios) {
      console.log("redirect to scenario overview")
      return (<Redirect to="/scenarios" />);
    }

    return (
      <div>
        {/*Scenario Users table*/}
        <h2 style={this.props.tableHeadingStyle}>Users sharing this scenario</h2>
        <Table data={this.props.scenario.users}>
          {this.props.currentUser.role === "Admin" ?
            <TableColumn
              title='ID'
              dataKey='id'
              width={70}
            />
            : <></>
          }
          <TableColumn
            title='Name'
            dataKey='username'
            width={300}
          />
          <TableColumn
            title='Role'
            dataKey='role'
            width={100}
          />
          <TableColumn
            title=''
            width={30}
            align='right'
            deleteButton
            onDelete={(index) => this.setState({
              deleteUserModal: true,
              deleteUserName: this.props.scenario.users[index].username,
              modalUserIndex: index
            })}
            locked={this.props.locked}
          />
        </Table>

        <InputGroup
          style={{
            width: 400,
            float: 'right'
          }}
        >
          <Form.Control
            placeholder="Username"
            onChange={(e) => this.onUserInputChange(e)}
            value={this.state.userToAdd}
            type="text"
          />
          <span className='icon-button'>
          <IconButton
            childKey={1}
            tooltip='Add User to Scenario'
            onClick={() => this.addUser()}
            icon='plus'
            disabled={this.props.locked}
            hidetooltip={this.props.locked}
          />
          </span>
        </InputGroup>
        <br />
        <br />

        <DeleteDialog
          title="Delete user from scenario"
          name={this.state.deleteUserName}
          show={this.state.deleteUserModal}
          onClose={(c) => this.closeDeleteUserModal(c)}
        />
      </div>
    )
  }
}

export default ScenarioUsersTable;

