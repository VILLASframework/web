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
import JSZip from 'jszip';
import {Button} from "react-bootstrap";
import FileSaver from 'file-saver';
import AppDispatcher from "../common/app-dispatcher";
import IconButton from "../common/icon-button";
import Table from "../common/table";
import TableColumn from "../common/table-column";
import DeleteDialog from "../common/dialogs/delete-dialog";
import EditResultDialog from "./edit-result";
import ResultConfigDialog from "./result-configs-dialog";
import NewResultDialog from "./new-result";

class ResultTable extends Component {

  constructor() {
    super();

    this.state = {
      editResultsModal: false,
      modalResultsData: {},
      modalResultsIndex: 0,
      newResultModal: false,
      filesToDownload: [],
      zipfiles: false,
      resultNodl: 0,
      resultConfigsModal: false,
      modalResultConfigs: {},
      modalResultConfigsIndex: 0,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // check whether file data has been loaded
    if (this.state.filesToDownload && this.state.filesToDownload.length > 0) {
      if (this.props.files !== prevProps.files) {
        if (!this.state.zipfiles) {
          let fileToDownload = this.props.files.filter(file => file.id === this.state.filesToDownload[0])
          if (fileToDownload.length === 1 && fileToDownload[0].data) {
            const blob = new Blob([fileToDownload[0].data], { type: fileToDownload[0].type });
            FileSaver.saveAs(blob, fileToDownload[0].name);
            this.setState({ filesToDownload: [] });
          }
        } else { // zip and save one or more files (download all button)
          let filesToDownload = this.props.files.filter(file => this.state.filesToDownload.includes(file.id) && file.data);
          if (filesToDownload.length === this.state.filesToDownload.length) { // all requested files have been loaded
            var zip = new JSZip();
            filesToDownload.forEach(file => {
              zip.file(file.name, file.data);
            });
            let zipname = "result_" + this.state.resultNodl + "_" + (new Date()).toISOString();
            zip.generateAsync({ type: "blob" }).then(function (content) {
              saveAs(content, zipname);
            });
            this.setState({ filesToDownload: [] });
          }
        }
      }
    }
  }

  closeNewResultModal(data) {
    this.setState({ newResultModal: false });
    if (data) {
      data["scenarioID"] = this.props.scenario.id;
      AppDispatcher.dispatch({
        type: 'results/start-add',
        data,
        token: this.props.sessionToken,
      });
    }
  }

  closeEditResultsModal() {
    this.setState({ editResultsModal: false });
  }

  downloadResultData(param) {
    let toDownload = [];
    let zip = false;

    if (typeof (param) === 'object') { // download all files
      toDownload = param.resultFileIDs;
      zip = true;
      this.setState({ filesToDownload: toDownload, zipfiles: zip, resultNodl: param.id });
    } else { // download one file
      toDownload.push(param);
      this.setState({ filesToDownload: toDownload, zipfiles: zip });
    }

    toDownload.forEach(fileid => {
      AppDispatcher.dispatch({
        type: 'files/start-download',
        data: fileid,
        token: this.props.sessionToken
      });
    });
  }

  closeDeleteResultsModal(confirmDelete) {
    this.setState({ deleteResultsModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'results/start-remove',
      data: this.state.modalResultsData,
      token: this.props.sessionToken,
    });
  }


  openResultConfigSnapshots(result) {
    if (result.configSnapshots === null || result.configSnapshots === undefined) {
      this.setState({
        modalResultConfigs: {"configs": []},
        modalResultConfigsIndex: result.id,
        resultConfigsModal: true
      });
    } else {
      this.setState({
        modalResultConfigs: result.configSnapshots,
        modalResultConfigsIndex: result.id,
        resultConfigsModal: true
      });
    }
  }

  closeResultConfigSnapshots() {
    this.setState({ resultConfigsModal: false });
  }

  modifyResultNoColumn(id, result) {
    return <Button variant="link" style={{ color: '#047cab' }} onClick={() => this.openResultConfigSnapshots(result)}>{id}</Button>
  }

  render() {

    return (
      <div>
        {/*Result table*/}
        <h2 style={this.props.tableHeadingStyle}>Results
        <span className='icon-button'>
          <IconButton
            ikey={1}
            tooltip='Add Result'
            onClick={() => this.setState({ newResultModal: true })}
            icon='plus'
            disabled={this.props.locked}
            hidetooltip={this.props.locked}
          />
          </span>
        </h2>

        <Table data={this.props.results}>
          <TableColumn
            title='ID'
            dataKey='id'
            modifier={(id, result) => this.modifyResultNoColumn(id, result)}
            width={70}
          />
          <TableColumn
            title='Description'
            dataKey='description'
            width={300}
          />
          <TableColumn
            title='Created at'
            dataKey='createdAt'
            width={200}
          />
          <TableColumn
            title='Last update'
            dataKey='updatedAt'
            width={200}
          />
          <TableColumn
            title='Files'
            dataKey='resultFileIDs'
            linkKey='filebuttons'
            data={this.props.files}
            onDownload={(index) => this.downloadResultData(index)}
            width={300}
          />
          <TableColumn
            width={200}
            align='right'
            editButton
            downloadAllButton
            deleteButton
            onEdit={index => this.setState({ editResultsModal: true, modalResultsIndex: index })}
            onDownloadAll={(index) => this.downloadResultData(this.props.results[index])}
            onDelete={(index) => this.setState({ deleteResultsModal: true, modalResultsData: this.props.results[index], modalResultsIndex: index })}
            locked={this.props.locked}
          />
        </Table>

        <EditResultDialog
          sessionToken={this.props.sessionToken}
          show={this.state.editResultsModal}
          files={this.props.files}
          results={this.props.results}
          resultId={this.state.modalResultsIndex}
          scenarioID={this.props.scenario.id}
          onClose={this.closeEditResultsModal.bind(this)}
        />
        <DeleteDialog
          title="result"
          name={this.state.modalResultsData.id}
          show={this.state.deleteResultsModal}
          onClose={(e) => this.closeDeleteResultsModal(e)}
        />
        <ResultConfigDialog
          show={this.state.resultConfigsModal}
          configs={this.state.modalResultConfigs}
          resultNo={this.state.modalResultConfigsIndex}
          onClose={this.closeResultConfigSnapshots.bind(this)}
        />
        <NewResultDialog
          show={this.state.newResultModal}
          onClose={data => this.closeNewResultModal(data)}
        />
      </div>
    )
  }
}

export default ResultTable;
