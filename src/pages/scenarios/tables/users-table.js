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

import { useState } from "react";
import { useSelector } from "react-redux";
import IconButton from "../../../common/buttons/icon-button";
import { Table, ButtonColumn, DataColumn } from "../../../common/table";
import { buttonStyle, tableHeadingStyle } from "../styles";
import { InputGroup, Form } from "react-bootstrap";
import DeleteDialog from "../../../common/dialogs/delete-dialog";
import NotificationsFactory from "../../../common/data-managers/notifications-factory";
import notificationsDataManager from "../../../common/data-managers/notifications-data-manager";
import { useGetUsersOfScenarioQuery, useAddUserToScenarioMutation, useRemoveUserFromScenarioMutation } from "../../../store/apiSlice";

const UsersTable = (props) => {
    const scenario = props.scenario;
    const {data, refetch: refetchUsers } = useGetUsersOfScenarioQuery(scenario.id);
    const [addUserToScenario, { isSuccess: isUserAdded }] = useAddUserToScenarioMutation();
    const [removeUserFromScenario, { isSuccess: isUserRemoved }] = useRemoveUserFromScenarioMutation();
    const users = data ? data.users : [];
    const [isDeleteUserModalOpened, setIsDeleteUserModalOpened] = useState(false);
    const [usernameToAdd, setUsernameToAdd] = useState("");
    const [usernameToDelete, setUsernameToDelete] = useState("");

    const { user: currentUser, token: sessionToken } = useSelector((state) => state.auth);

    const addUser = async () => {
      if(usernameToAdd.trim() === ''){
        notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR('Please, enter correct username'));
      } else {
        try {
          await addUserToScenario({ scenarioID: props.scenario.id, username: usernameToAdd }).unwrap();
        } catch (err) {
          notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
        }
  
        refetchUsers();
      }

      setUsernameToAdd('');
    };

    const removeUser = async (confirmed) => {
      if(confirmed){
        try {
          await removeUserFromScenario({ scenarioID: props.scenario.id, username: usernameToDelete }).unwrap();
        } catch (err) {
          notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(err.data.message));
        }
      }

      refetchUsers();
      setUsernameToDelete('');
      setIsDeleteUserModalOpened(false);
    }
    
    return (
        <div>
          {/*Scenario Users table*/}
          <h2 style={tableHeadingStyle}>Users sharing this scenario</h2>
          <Table data={users}>
            {currentUser.role === "Admin" ?
              <DataColumn
                title='ID'
                dataKey='id'
                width={70}
              />
              : <></>
            }
            <DataColumn
              title='Name'
              dataKey='username'
              width={300}
            />
            <DataColumn
              title='Role'
              dataKey='role'
              width={100}
            />
            <ButtonColumn
              title=''
              width={30}
              align='right'
              deleteButton
              onDelete={(index) => {
                setIsDeleteUserModalOpened(true);
                setUsernameToDelete(users[index].username);
              }}
              locked={scenario.isLocked}
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
              onChange={(e) => {setUsernameToAdd(e.target.value)}}
              value={usernameToAdd}
              type="text"
            />
            <span className='icon-button'>
            <IconButton
              childKey={1}
              tooltip='Add User to Scenario'
              onClick={() => {
                addUser()
              }}
              icon='plus'
              disabled={false}
              hidetooltip={false}
              buttonStyle={buttonStyle}
            />
            </span>
          </InputGroup>
          <br />
          <br />
  
          <DeleteDialog
            title="Delete user from scenario"
            name={usernameToDelete}
            show={isDeleteUserModalOpened}
            onClose={(c) => {removeUser(c)}}
          />
        </div>
      )
}

export default UsersTable;
