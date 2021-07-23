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
import FileSaver from 'file-saver';
import IconButton from "../common/buttons/icon-button";
import Table from "../common/table";
import TableColumn from "../common/table-column";
import EditDashboardDialog from "./edit-dashboard";
import ImportDashboardDialog from "./import-dashboard";
import DeleteDialog from "../common/dialogs/delete-dialog";
import AppDispatcher from "../common/app-dispatcher";
import NewDialog from "../common/dialogs/new-dialog";

class DashboardTable extends Component {

  constructor() {
    super();

    this.state = {
      newDashboardModal: false,
      deleteDashboardModal: false,
      importDashboardModal: false,
      modalDashboardData: {},
      dashboardEditModal: false,
    }
  }

  closeNewDashboardModal(data) {
    this.setState({ newDashboardModal: false });
    if (data) {
      let newDashboard = {};
      newDashboard["name"] = data.value;
      // add default grid value and scenarioID
      newDashboard["grid"] = 15;
      newDashboard["scenarioID"] = this.props.scenario.id;

      AppDispatcher.dispatch({
        type: 'dashboards/start-add',
        data: newDashboard,
        token: this.props.sessionToken,
      });
    }
  }

  closeEditDashboardModal(data) {
    this.setState({ dashboardEditModal: false });

    let editDashboard = this.state.modalDashboardData;

    if (data != null) {
      editDashboard.name = data.name;
      AppDispatcher.dispatch({
        type: 'dashboards/start-edit',
        data: editDashboard,
        token: this.props.sessionToken
      });
    }
  }

  closeDeleteDashboardModal(confirmDelete) {
    this.setState({ deleteDashboardModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'dashboards/start-remove',
      data: this.state.modalDashboardData,
      token: this.props.sessionToken,
    });
  }

  closeImportDashboardModal(data) {
    this.setState({ importDashboardModal: false });

    if (data) {
      let newDashboard = JSON.parse(JSON.stringify(data));
      newDashboard["scenarioID"] = this.props.scenario.id;

      AppDispatcher.dispatch({
        type: 'dashboards/start-add',
        data: newDashboard,
        token: this.props.sessionToken,
      });
    }
  }

  copyDashboard(index) {
    let dashboard = JSON.parse(JSON.stringify(this.props.dashboards[index]));

    let widgets = JSON.parse(JSON.stringify(this.props.widgets.filter(w => w.dashboardID === parseInt(dashboard.id, 10))));
    widgets.forEach((widget) => {
      delete widget.dashboardID;
      delete widget.id;
    })
    dashboard["widgets"] = widgets;
    delete dashboard.scenarioID;
    delete dashboard.id;

    return dashboard;
  }

  exportDashboard(index) {
    let dashboard = this.copyDashboard(index);

    // show save dialog
    const blob = new Blob([JSON.stringify(dashboard, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'dashboard - ' + dashboard.name + '.json');
  }

  duplicateDashboard(index) {
    let newDashboard = this.copyDashboard(index);
    newDashboard.scenarioID = this.props.scenario.id;
    newDashboard.name = newDashboard.name + '_copy';

    AppDispatcher.dispatch({
      type: 'dashboards/start-add',
      data: newDashboard,
      token: this.props.sessionToken,
    });
  }

  render() {
    const buttonStyle = {
      marginLeft: '10px',
    }

    const iconStyle = {
      height: '30px',
      width: '30px'
    }

    return (
      <div>
        {/*Dashboard table*/}
        <h2 style={this.props.tableHeadingStyle}>Dashboards
          <span className='icon-button'>
              <IconButton
                childKey={0}
                tooltip='Add Dashboard'
                onClick={() => this.setState({newDashboardModal: true})}
                icon='plus'
                disabled={this.props.locked}
                hidetooltip={this.props.locked}
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
              />
              <IconButton
                childKey={1}
                tooltip='Import Dashboard'
                onClick={() => this.setState({importDashboardModal: true})}
                icon='upload'
                disabled={this.props.locked}
                hidetooltip={this.props.locked}
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
              />
            </span>
        </h2>
        <Table data={this.props.dashboards}>
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
            dataKey='name'
            link='/dashboards/'
            linkKey='id'
            width={300}
          />
          <TableColumn
            title='Grid'
            dataKey='grid'
            width={100}
          />

          <TableColumn
            title=''
            width={200}
            align='right'
            editButton
            deleteButton
            exportButton
            duplicateButton
            onEdit={index => this.setState({
              dashboardEditModal: true,
              modalDashboardData: this.props.dashboards[index]
            })}
            onDelete={(index) => this.setState({
              deleteDashboardModal: true,
              modalDashboardData: this.props.dashboards[index],
              modalDashboardIndex: index
            })}
            onExport={index => this.exportDashboard(index)}
            onDuplicate={index => this.duplicateDashboard(index)}
            locked={this.props.locked}
          />
        </Table>

        <NewDialog
          show={this.state.newDashboardModal}
          title="New Dashboard"
          inputLabel="Name"
          placeholder="Enter name"
          onClose={data => this.closeNewDashboardModal(data)}
        />

        <EditDashboardDialog
          show={this.state.dashboardEditModal}
          dashboard={this.state.modalDashboardData}
          onClose={data => this.closeEditDashboardModal(data)}
        />
        <ImportDashboardDialog
          show={this.state.importDashboardModal}
          onClose={data => this.closeImportDashboardModal(data)}
        />
        <DeleteDialog
          title="dashboard"
          name={this.state.modalDashboardData.name}
          show={this.state.deleteDashboardModal}
          onClose={(e) => this.closeDeleteDashboardModal(e)}
        />

      </div>
    )
  }
}

export default DashboardTable;
