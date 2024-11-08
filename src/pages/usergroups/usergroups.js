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
import {
  useGetUsergroupsQuery,
  useAddUsergroupMutation,
  useDeleteUsergroupMutation,
} from "../../store/apiSlice";
import {
  Table,
  DataColumn,
  LinkColumn,
  ButtonColumn,
} from "../../common/table";
import IconButton from "../../common/buttons/icon-button";
import { buttonStyle, iconStyle } from "./styles";
import AddUsergroupDialog from "./dialogs/addUsergroupDialog";
import DeleteDialog from "../../common/dialogs/delete-dialog";
import moment from "moment";
import notificationsDataManager from "../../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../../common/data-managers/notifications-factory";
import { Spinner } from "react-bootstrap";

const Usergroups = () => {
  const {
    data: { usergroups } = {},
    refetch: refetchUsergroups,
    isLoading,
  } = useGetUsergroupsQuery();
  const [addUsergroup] = useAddUsergroupMutation();
  const [deleteUsergroup] = useDeleteUsergroupMutation();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogUsegroup, setDialogUsergroup] = useState({});

  const handleAddNewGroup = async (response) => {
    if (response) {
      try {
        //put data in correct structure
        const usergroup = {
          name: response.name,
          scenarioMappings: response.scenarioMappings,
        };
        await addUsergroup(usergroup).unwrap();

        refetchUsergroups();
      } catch (err) {
        notificationsDataManager.addNotification(
          NotificationsFactory.UPDATE_ERROR(err.data.message)
        );
      }
    }
    setIsAddDialogOpen(false);
  };

  const handleDeleteUsergroup = async (isConfirmed) => {
    if (isConfirmed) {
      try {
        await deleteUsergroup(dialogUsegroup.id);
        refetchUsergroups();
      } catch (err) {
        notificationsDataManager.addNotification(
          NotificationsFactory.UPDATE_ERROR(err.data.message)
        );
      }
    }

    setDialogUsergroup({});
    setIsDeleteDialogOpen(false);
  };

  const stateUpdateModifier = (dateString) => {
    const date = moment(dateString);
    return `${date.fromNow()}`;
  };

  if (isLoading) return <Spinner />;

  if (usergroups) {
    return (
      <div className="section">
        <h1>
          User Groups
          <span className="icon-button">
            <IconButton
              childKey={0}
              tooltip="Add Usergroup"
              onClick={() => setIsAddDialogOpen(true)}
              icon="plus"
              buttonStyle={buttonStyle}
              iconStyle={iconStyle}
            />
          </span>
        </h1>
        <Table data={usergroups}>
          <DataColumn title="ID" dataKey="id" width={70} />
          <LinkColumn
            title="Name"
            dataKey="name"
            link="/usergroup/"
            linkKey="id"
          />
          <DataColumn
            title="Last Update"
            dataKey="updatedAt"
            modifier={(updatedAt) => stateUpdateModifier(updatedAt)}
          />
          <ButtonColumn
            width="200"
            align="right"
            deleteButton
            onDelete={(index) => {
              setDialogUsergroup(usergroups[index]);
              setIsDeleteDialogOpen(true);
            }}
          />
        </Table>

        <AddUsergroupDialog
          isModalOpened={isAddDialogOpen}
          onClose={handleAddNewGroup}
        />
        <DeleteDialog
          title="scenario"
          name={dialogUsegroup.name}
          show={isDeleteDialogOpen}
          onClose={(isConfirmed) => handleDeleteUsergroup(isConfirmed)}
        />
      </div>
    );
  }
};

export default Usergroups;
