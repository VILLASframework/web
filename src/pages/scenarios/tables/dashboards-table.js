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
import IconButton from "../../../common/buttons/icon-button";
import { Table, ButtonColumn, LinkColumn, DataColumn } from "../../../common/table";
import { buttonStyle, tableHeadingStyle, iconStyle } from "../styles";
import { currentUser, sessionToken } from "../../../localStorage";
import { InputGroup, Form } from "react-bootstrap";
import { useGetDashboardsQuery } from "../../../store/apiSlice";
import {Button} from "react-bootstrap";
import NewDialog from "../../../common/dialogs/new-dialog";
import DeleteDialog from "../../../common/dialogs/delete-dialog";
import ImportDashboardDialog from "../dialogs/import-dashboard";
import EditDashboardDialog from "../dialogs/edit-dashboard";
import NotificationsFactory from "../../../common/data-managers/notifications-factory";
import notificationsDataManager from "../../../common/data-managers/notifications-data-manager";
import FileSaver from "file-saver";
import { 
  useAddDashboardMutation, 
  useDeleteDashboardMutation,
  useUpdateDashboardMutation,
  useLazyGetWidgetsQuery,
  useAddWidgetMutation,
} from "../../../store/apiSlice";
import { rest } from "lodash";

const DashboardsTable = ({scenario}) => {
    const {data: fetchedDashboards, refetch: refetchDashboards } = useGetDashboardsQuery(scenario.id);
    const [addDashboard] = useAddDashboardMutation();
    const [deleteDashboard] = useDeleteDashboardMutation();
    const [updateDashboard] = useUpdateDashboardMutation();
    const [addWidgetToDashboard] = useAddWidgetMutation();

    const [triggerGetWidgets, { isLoading: isWidgetsLoading, data: widgets, error: widgetsError }] = useLazyGetWidgetsQuery();

    const dashboards = fetchedDashboards ? fetchedDashboards.dashboards : [];

    const [isNewModalOpened, setIsNewModalOpened] = useState(false);
    const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
    const [isEditModalOpened, setIsEditModalOpened] = useState(false);
    const [isImportModalOpened, setIsImportModalOpened] = useState(false);

    const [dashboardToDelete, setDashboardToDelete] = useState({});
    const [dashboardToEdit, setDashboardToEdit] = useState({});

    const handleNewDashboard = async(data) => {
      if(data){
        const newDashboard = {
          Grid: 15,
          Height: 0,
          Name: data.value,
          ScenarioID: scenario.id,
        };

        try {
          await addDashboard({ dashboard: newDashboard }).unwrap();
        } catch (err) {
          notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
        }
      }

      refetchDashboards();
      setIsNewModalOpened(false);
    }

    const handleImportDashboard = async(data) => {
      if(data){
        const toImportDashboard = {
          Grid: data.grid ? data.grid : 15,
          Height: data.height? data.height : 0,
          Name: data.name,
          ScenarioID: scenario.id,
        }
        try{
          const res = await addDashboard({ dashboard: toImportDashboard }).unwrap();
          if(data.widgets.length > 0){
            for(let widget of data.widgets){
              widget.scenarioID = scenario.id;
              widget.dashboardID = res.dashboard.id;
              await addWidgetToDashboard(widget).unwrap();
            }
          }
        } catch (err) {
          console.log(err)
        }
      }

      refetchDashboards();
      setIsImportModalOpened(false);
    }

    const handleEditDashboard = async(editedDashboard) => {
      if(editedDashboard){
        //as for now modal only allows to edit the name
        const {name, ...rest} = dashboardToEdit;
        const updatedDashboard = {name: editedDashboard.name, ...rest};
        try {
          await updateDashboard({ dashboardID: updatedDashboard.id, dashboard: updatedDashboard }).unwrap();
        } catch (err) { 
          notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
        }
      }

      refetchDashboards();
      setIsEditModalOpened(false);
    }

    const handleDeleteDashboard = async(isConfirmed) => {
      if(isConfirmed){
        try {
          await deleteDashboard(dashboardToDelete.id).unwrap();
        } catch (err) {
          notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
        }
      }

      refetchDashboards();
      setIsDeleteModalOpened(false);
    }

    const copyDashboard = async (dashboardToCopy) => {
      let copiedDashboard = JSON.parse(JSON.stringify(dashboardToCopy));

      try {
        const widgetsResponse = await triggerGetWidgets(dashboardToCopy.id).unwrap();
        let parsedWidgets = [];
        if(widgetsResponse.widgets.length > 0){
          parsedWidgets = JSON.parse(JSON.stringify(widgetsResponse.widgets.filter(w => w.dashboardID === parseInt(dashboardToCopy.id, 10))));
          parsedWidgets.forEach((widget) => {
            delete widget.dashboardID;
            delete widget.id;
          })
        }
  
        copiedDashboard["widgets"] = parsedWidgets;
        delete copiedDashboard.scenarioID;
        delete copiedDashboard.id;

        return copiedDashboard;
      } catch (err) {
        notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
        return null;
      }
    }

    const duplicateDashboard = async (originalDashboard) => {      
      try {
        //in order to properly duplicate existing dashboard, we need first to create an new 
        //one with same initital parameters and then add all the widget subobjects to it
        const duplicatedDashboard = await copyDashboard(originalDashboard);
        duplicatedDashboard.scenarioID = scenario.id;
        duplicatedDashboard.name = `${originalDashboard.name}_copy`;
        const widgets = duplicatedDashboard.widgets;
        
        const res = await addDashboard({ dashboard: duplicatedDashboard }).unwrap();

        if(widgets.length > 0){
          for(let widget of widgets){
            widget.scenarioID = scenario.id;
            widget.dashboardID = res.dashboard.id;
            await addWidgetToDashboard(widget).unwrap();
          }
        }
      } catch (err) {
        notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
      }

      refetchDashboards();      
    }

    const exportDashboard = async (dashboard) => {
      try {
        //remove unnecessary fields and get widgets
        const dashboardToExport = await copyDashboard(dashboard);
        const fileName = dashboardToExport.name.replace(/\s+/g, '-').toLowerCase();
        const blob = new Blob([JSON.stringify(dashboardToExport, null, 2)], { type: 'application/json' });
        FileSaver.saveAs(blob, 'dashboard-' + fileName + '.json');
      } catch (err) {
        console.log(err);
      }
    }

    return (
        <div>
          {/*Dashboard table*/}
          <h2 style={tableHeadingStyle}>Dashboards
            <span className='icon-button'>
                <IconButton
                  childKey={0}
                  tooltip='Add Dashboard'
                  onClick={() => {
                    setIsNewModalOpened(true);
                  }}
                  icon='plus'
                  disabled={scenario.isLocked}
                  hidetooltip={scenario.isLocked}
                  buttonStyle={buttonStyle}
                  iconStyle={iconStyle}
                />
                <IconButton
                  childKey={1}
                  tooltip='Import Dashboard'
                  onClick={() => {
                    setIsImportModalOpened(true);
                  }}
                  icon='upload'
                  disabled={scenario.isLocked}
                  hidetooltip={scenario.isLocked}
                  buttonStyle={buttonStyle}
                  iconStyle={iconStyle}
                />
              </span>
          </h2>
          <Table data={dashboards}>
            {currentUser.role === "Admin" ?
              <DataColumn
                title='ID'
                dataKey='id'
                width={70}
              />
              : <></>
            }
            <LinkColumn
              title='Name'
              dataKey='name'
              link='/dashboards/'
              linkKey='id'
              width={300}
            />
            <DataColumn
              title='Grid'
              dataKey='grid'
              width={100}
            />
  
            <ButtonColumn
              title=''
              width={200}
              align='right'
              editButton
              deleteButton
              exportButton
              duplicateButton
              onEdit={index => {
                setDashboardToEdit(dashboards[index]);
                setIsEditModalOpened(true);
              }}
              onDelete={(index) => {
                setDashboardToDelete(dashboards[index]);
                setIsDeleteModalOpened(true);
              }}
              onExport={index => {
                exportDashboard(dashboards[index]);
              }}
              onDuplicate={index => {
                duplicateDashboard(dashboards[index]);
              }}
              locked={scenario.isLocked}
            />
          </Table>

          <NewDialog
            show={isNewModalOpened}
            title="New Dashboard"
            inputLabel="Name"
            placeholder="Enter name"
            onClose={data => handleNewDashboard(data)}
          />

          <EditDashboardDialog
            show={isEditModalOpened}
            dashboard={dashboardToEdit}
            onClose={data => handleEditDashboard(data)}
          />

          <ImportDashboardDialog
            show={isImportModalOpened}
            onClose={data => handleImportDashboard(data)}
          />

          <DeleteDialog
            title="dashboard"
            name={dashboardToDelete.name}
            show={isDeleteModalOpened}
            onClose={(isConfirmed) => handleDeleteDashboard(isConfirmed)}
          />
        </div>
      )
}

export default DashboardsTable;
