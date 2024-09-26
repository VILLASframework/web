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
import { useGetScenariosQuery, useGetUsergroupByIdQuery } from "../../../store/apiSlice";
import { Table, DataColumn, LinkColumn, ButtonColumn } from "../../../common/table";
import { iconStyle, buttonStyle } from "../styles";
import IconButton from "../../../common/buttons/icon-button";
import AddScenarioMappingDialog from "../dialogs/addScenarioMappingDialog";
import { useUpdateUsergroupMutation } from "../../../store/apiSlice";
import DeleteDialog from "../../../common/dialogs/delete-dialog";
import notificationsDataManager from "../../../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../../../common/data-managers/notifications-factory";

const UsergroupScenariosTable = ({usergroupID}) => {
    const {data: {usergroup} = {}, isLoading, refetch} = useGetUsergroupByIdQuery(usergroupID);
    const {data: {scenarios} = {}, isLoading: isScenariosLoading } = useGetScenariosQuery();
    const [isAddScenarioDialogOpen, setIsAddScenarioDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [mappingToDelete, setMappingToDelete] = useState({scenarioID: null});
    const [updateUsergroup] = useUpdateUsergroupMutation();

    const handleAddScenarioMapping = async (newMapping) => {
        if(newMapping){
            try{
                //add new mapping while saving name and existing mappings if there are any
                const oldMappings = usergroup.scenarioMappings.length > 0 ? [...usergroup.scenarioMappings] : [];
                await updateUsergroup({usergroupID: usergroupID, usergroup: {name: usergroup.name, scenarioMappings: [...oldMappings, newMapping]}}).unwrap();
                refetch();
            } catch (err) {
                notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
            }
        }
        setIsAddScenarioDialogOpen(false);
    }

    const handleRemoveScenarioMapping = async (isConfirmed) => {
        if(isConfirmed){
            try {
                //update usergroup with new mappings without the target
                const newMappings = [...usergroup.scenarioMappings].filter(mapping => mapping.id !== mappingToDelete.id);
                await updateUsergroup({usergroupID: usergroupID, usergroup: {name: usergroup.name, scenarioMappings: newMappings}}).unwrap();
                refetch();
            } catch (error) {
                console.log("Error removing mapping", error);
            }
        }
        setIsDeleteDialogOpen(false);
        setMappingToDelete({scenarioID: null});
    }

    const getScenarioName = (scenarioID) => {
        if(isScenariosLoading){
            return <div>Loading...</div>;
        }
        
        const scenario = scenarios.find((scenario) => scenario.id === scenarioID);

        return scenario ? <div>{scenario.name}</div> : <div>unknown</div>;
    }

    const getDuplicateLabel = (duplicate) => {
        return duplicate ? <div>yes</div> : <div>no</div>;
    }

    if(isLoading) return <div>Loading...</div>;

    return (<div className="section"> 
        <h2>
        Scenario Mappings
        <span className="icon-button">
            <IconButton
                childKey={0}
                tooltip="Add Scenario Mapping"
                onClick={() => setIsAddScenarioDialogOpen(true)}
                icon="plus"
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
            />
        </span>
        </h2>
        <Table data={usergroup.scenarioMappings}>
            <LinkColumn title="Scenario ID" dataKey="scenarioID" link="/scenarios/" linkKey="scenarioID" width={120} />
            <DataColumn title='Name' dataKey='scenarioID' modifier={(scenarioID) => getScenarioName(scenarioID)}/>
            <DataColumn title='Duplicated' dataKey='duplicate' modifier={(duplicate) => getDuplicateLabel(duplicate)}/>
            <ButtonColumn
              width="200"
              align="right"
              deleteButton
              onDelete={(index) => {
                setMappingToDelete(usergroup.scenarioMappings[index]);
                setIsDeleteDialogOpen(true);
              }}
            />
        </Table>

        <AddScenarioMappingDialog isDialogOpened={isAddScenarioDialogOpen} mappings={usergroup.scenarioMappings} onClose={(newMapping) => handleAddScenarioMapping(newMapping)} />
        <DeleteDialog
          title="scenario mapping for scenario"
          name={mappingToDelete.scenarioID}
          show={isDeleteDialogOpen}
          onClose={(isConfirmed) => handleRemoveScenarioMapping(isConfirmed)}
        />
    </div>);
}

export default UsergroupScenariosTable;
