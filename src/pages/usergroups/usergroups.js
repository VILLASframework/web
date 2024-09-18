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
import { useGetUsergroupsQuery, useAddUserGroupMutation } from "../../store/apiSlice";
import { Table, DataColumn, LinkColumn } from "../../common/table";
import IconButton from "../../common/buttons/icon-button";
import { buttonStyle, iconStyle } from "./styles";
import AddUsergroupDialog from "./dialogs/addUsergroupDialog";

const Usergroups = (props) => {
    const {data: {usergroups} = {}, refetch: refetchUsergroups, isLoading} = useGetUsergroupsQuery();
    const [addUserGroup] = useAddUserGroupMutation();
    
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleAddNewGroup = async (response) => {
      if(response){
        try {
          //put data in correct structure
          const usergroup = {Name: response.name, ScenarioMappings: [{Duplicate: response.isDuplicateSelected, ScenarioID: Number(response.scenarioID)}]};
          await addUserGroup(usergroup).unwrap();
      
          refetchUsergroups();
        } catch (err) {
          console.log("Error adding usergroup: ", err);
        }
      }
      setIsAddDialogOpen(false);
    }
    
    if(isLoading) return <div>Loading</div>;

    if(usergroups){
      return (<div className="section"> 
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
            <DataColumn
              title='ID'
              dataKey='id'
              width={70}
            />
            <LinkColumn
              title="Name"
              dataKey="name"
              link="/usergroup/"
              linkKey="id"
            />
        </Table>

        <AddUsergroupDialog isModalOpened={isAddDialogOpen} onClose={handleAddNewGroup} />
    </div>);
    }
}

export default Usergroups;
