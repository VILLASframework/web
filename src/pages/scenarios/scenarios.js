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
import IconButton from "../../common/buttons/icon-button";
import { Table, ButtonColumn, DataColumn, LinkColumn } from "../../common/table";
import { buttonStyle, iconStyle } from "./styles";
import NewScenarioDialog from "./dialogs/new-scenario";
import ImportScenarioDialog from "./dialogs/import-scenario";
import DeleteDialog from "../../common/dialogs/delete-dialog";
import EditScenarioDialog from "./dialogs/edit-scenario";
import FileSaver from 'file-saver';
import {
  useGetScenariosQuery, 
  useAddScenarioMutation, 
  useDeleteScenarioMutation,
  useUpdateScenarioMutation,
  useGetConfigsQuery,
  useGetDashboardsQuery,
} from "../../store/apiSlice";
import { useSelector } from "react-redux";

const Scenarios = (props) => {

    const { data , error, refetch: refetchScenarios } = useGetScenariosQuery();
    const scenarios = data?.scenarios;

    const { user: currentUser, token: sessionToken } = useSelector((state) => state.auth);

    const [modalScenario, setModalScenario] = useState({name: 'error'});
    const [isNewModalOpened, setIsNewModalOpened] = useState(false);
    const [isEditModalOpened, setIsEditModalOpened] = useState(false);
    const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
    const [selectedScenarioID, setSelectedScenarioID] = useState(null);

    const { data: configs } = useGetConfigsQuery(selectedScenarioID, {
      skip: !selectedScenarioID,
    });

    const { data: dashboards } = useGetDashboardsQuery(selectedScenarioID, {
      skip: !selectedScenarioID,
    });

    const [postScenario, {isLoadingPost}] = useAddScenarioMutation();
    const [deleteScenario, {isLoadingDelete}] = useDeleteScenarioMutation();
    const [updateScenario, {isLoadingUpdate}] = useUpdateScenarioMutation();

    const onAddScenario = async (data) => {
      //if a new scenario is to be added
      try {
        await postScenario({scenario: data}).unwrap();
        refetchScenarios();
      } catch (error) {
        console.log('Error adding scenario', error)
      }

      setIsNewModalOpened(false);
    }

    const onDeleteScenario = async (e) => {
      if(e){
        try{
          await deleteScenario(modalScenario.id);
          refetchScenarios();
        } catch(error){
          console.log('Error deleting scenario', error)
        }
      }

      setIsDeleteModalOpened(false);
    }

    const onEditScenario = async (data) => {
      console.log("data: ", {scenario: data});
      if(data){
        try{
          await updateScenario({id: modalScenario.id, ...{scenario: data}}).unwrap();
          refetchScenarios();
        } catch(error){
          if(error.data){
            notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(err.data.message));
          } else {
            notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR("Unknown error"));
          }
        }
      }
      
      setIsEditModalOpened(false);
    }

    const onScenarioLock = async (index) => {
      try{
        const data = {...scenarios[index]};
        data.isLocked = !data.isLocked;
        await updateScenario({id: scenarios[index].id, ...{scenario: data}}).unwrap();
        refetchScenarios();
      } catch(error){
        console.log('Error locking/unlocking scenario', error)
      }
    }

    const onScenarioDuplicate = async (index) => {
      try{
        let scenario = JSON.parse(JSON.stringify(scenarios[index]));
        scenario.name = scenario.name + "_copy";
        let jsonObj = scenario;
        setSelectedScenarioID(scenario.id);
        jsonObj["configs"] = configs;
        jsonObj["dashboards"] = dashboards;
        await postScenario({scenario: jsonObj}).unwrap();
        refetchScenarios();
      } catch(error){
        console.log('Error duplicating scenario', error)
      }
    }

    const onExportScenario = (index) => {
      // filter properties
      let toExport = {...scenarios[index]};
      delete toExport.id;

      const fileName = toExport.name.replace(/\s+/g, '-').toLowerCase();
      
      // show save dialog
      const blob = new Blob([JSON.stringify(toExport, null, 2)], { type: 'application/json' });
      FileSaver.saveAs(blob, 'scenario-' + fileName + '.json');
    }
    
    return (
        <div className="section">
          <h1>
            Scenarios
            <span className="icon-button">
              <IconButton
                childKey={0}
                tooltip="Add Scenario"
                onClick={() => setIsNewModalOpened(true)}
                icon="plus"
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
              />
              <IconButton
                childKey={1}
                tooltip="Import Scenario"
                onClick={() => {}}
                icon="upload"
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
              />
            </span>
          </h1>
  
          <Table data={scenarios}>
            {currentUser.role === "Admin" ? (
              <DataColumn title="ID" dataKey="id" />
            ) : (
              <></>
            )}
            <LinkColumn
              title="Name"
              dataKey="name"
              link="/scenarios/"
              linkKey="id"
            />
            {currentUser.role === "Admin" ? (
              <ButtonColumn
                title="Locked"
                lockButton
                onChangeLock={(index, event) => onScenarioLock(index)}
                isLocked={(index) => {return scenarios[index].isLocked}}
              />
            ) : (
              <></>
            )}
  
            <ButtonColumn
              width="200"
              align="right"
              editButton
              deleteButton
              exportButton
              duplicateButton
              onEdit={(index) =>{
                setModalScenario(scenarios[index]);
                setIsEditModalOpened(true);
              }}
              onDelete={(index) => {
                setModalScenario(scenarios[index]);
                setIsDeleteModalOpened(true);
              }}
              onExport={(index) => {onExportScenario(index)}}
              onDuplicate={(index) => {onScenarioDuplicate(index)}}
              isLocked={(index) => {return scenarios[index].isLocked}}
            />
          </Table>
  
          <NewScenarioDialog
            show={isNewModalOpened}
            onClose={(data) => onAddScenario(data)}
          />

          <EditScenarioDialog
            show={isEditModalOpened}
            onClose={(data) => {onEditScenario(data)}}
            scenario={modalScenario}
          />

          <ImportScenarioDialog
            show={false}
            onClose={(data) => {}}
            nodes={null}
          />
  
          <DeleteDialog
            title="scenario"
            name={modalScenario.name}
            show={isDeleteModalOpened}
            onClose={(e) => onDeleteScenario(e)}
          />
        </div>
      );
}

export default Scenarios;
