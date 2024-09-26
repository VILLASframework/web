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
import { useGetUsersByUsergroupIdQuery, useAddUserToUsergroupMutation, useDeleteUserFromUsergroupMutation  } from "../../../store/apiSlice";
import { Table, DataColumn, LinkColumn, ButtonColumn } from "../../../common/table";
import { iconStyle, buttonStyle } from "../styles";
import IconButton from "../../../common/buttons/icon-button";
import AddUserToUsergroupDialog from "../dialogs/addUserToUsergroupDialog";
import NotificationsFactory from "../../../common/data-managers/notifications-factory";
import notificationsDataManager from "../../../common/data-managers/notifications-data-manager";

const UsergroupUsersTable = ({usergroupID}) => {
    const {data: {users}=[], isLoading, refetch} = useGetUsersByUsergroupIdQuery(usergroupID);
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const [addUserToUsergroup] = useAddUserToUsergroupMutation();
    const [removeUserFromGroup] = useDeleteUserFromUsergroupMutation();

    const handleAddUser = async (selectedUsers) => {
        if(selectedUsers.length > 0){
            try {
                await Promise.all(selectedUsers.map(user => addUserToUsergroup({usergroupID: usergroupID, username: user.username}).unwrap()));
                refetch();
            } catch (error) {
                console.log('Error adding users', error);
            }
        }
        setIsAddUserDialogOpen(false);
    }

    const handleRemoveUser = async (user) => {
        try{
            await removeUserFromGroup({usergroupID: usergroupID, username: user.username}).unwrap();
            refetch();
        } catch(error) {
            console.log('Error removing users', error);
        }
    }

    if(isLoading) return <div>Loading...</div>;

    return (<div className="section"> 
        <h2>
        Users
        <span className="icon-button">
            <IconButton
                childKey={0}
                tooltip="Add Users"
                onClick={() => setIsAddUserDialogOpen(true)}
                icon="plus"
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
            />
        </span>
        </h2>
        <Table data={users}>
            <DataColumn title='ID' dataKey='id' width={70} />
            <DataColumn title="Username" dataKey="username" width={150} />
            <ButtonColumn
              width="200"
              align="right"
              deleteButton
              onDelete={(index) => handleRemoveUser(users[index])}
            />
        </Table>
        <AddUserToUsergroupDialog 
            isModalOpened={isAddUserDialogOpen} 
            onClose={(selectedUsers) => handleAddUser(selectedUsers)}
            currentUsers={users}
        />
    </div>);
}

export default UsergroupUsersTable;
