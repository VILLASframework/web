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

import { useState, useEffect } from "react";
import IconButton from "../../../common/buttons/icon-button";
import { Table, ButtonColumn, DataColumn, LinkbuttonColumn } from "../../../common/table";
import { buttonStyle, tableHeadingStyle, iconStyle } from "../styles";
import DeleteDialog from "../../../common/dialogs/delete-dialog";
import ResultConfigDialog from "../dialogs/result-configs-dialog";
import ResultPythonDialog from "../dialogs/result-python-dialog";
import NewDialog from "../../../common/dialogs/new-dialog";
import {Button} from "react-bootstrap";
import NotificationsFactory from "../../../common/data-managers/notifications-factory";
import notificationsDataManager from "../../../common/data-managers/notifications-data-manager";
import FileSaver from "file-saver";
import { 
  useGetResultsQuery,
  useAddResultMutation,
  useDeleteResultMutation,
  useGetFilesQuery,
  useLazyDownloadFileQuery,
 } from "../../../store/apiSlice";
import JSZip from 'jszip';

const ResultsTable = (props) => {
    const scenario = props.scenario;
    const {data, refetch: refetchResults } = useGetResultsQuery(scenario.id);
    const results = data ? data.results : [];
    const [addResult] = useAddResultMutation();
    const [deleteResult] = useDeleteResultMutation();
    const {data: filesData } = useGetFilesQuery(scenario.id);
    const files = filesData ? filesData.files : [];

    const [isNewDialogOpened, setIsNewDialogOpened] = useState(false);
    const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
    const [isResultConfigDialogOpened, setIsResultConfigDialogOpened] = useState(false);
    const [isPythonDialogOpened, setIsPythonDialogOpened] = useState(false);
    const [modalResultConfigs, setModalResultConfigs] = useState([]);
    const [modalResultConfigsIndex, setModalResultConfigsIndex] = useState(-1);
    const [modalResultsIndex, setModalResultsIndex] = useState(0);
    const [resultToDelete, setResultToDelete] = useState({});

    const [triggerDownloadFile] = useLazyDownloadFileQuery();
  
    const handleDownloadAllFiles = async (resultIndex) => {
      const result = results[resultIndex];
      if (result && result.resultFileIDs && result.resultFileIDs.length > 0) {
        const zip = new JSZip();
        for (const fileID of result.resultFileIDs) {
          try {
            const res = await triggerDownloadFile(fileID);
            const file = files.find(f => f.id === fileID);
            const blob = new Blob([res], { type: 'application/octet-stream' });
            zip.file(file.name, blob);
          } catch (error) {
            notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(`Failed to download file with ID ${fileID}`));
            console.error(`Failed to download file with ID ${fileID}`, error);
          }
        }
        zip.generateAsync({ type: 'blob' })
        .then((content) => {
          FileSaver.saveAs(content, `result-${result.id}.zip`);
        })
        .catch((err) => {
          notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR('Failed to create ZIP archive'));
          console.error('Failed to create ZIP archive', err);
        });
      } else {
        notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR('No files to download for the selected result'));
      }
    };

    const handleDownloadFile = async (fileID) => {
      try {
        const res = await triggerDownloadFile(fileID);
        const file = files.find(f => f.id === fileID);
        const blob = new Blob([res.data], { type: file.type });
        FileSaver.saveAs(blob, file.name);
      } catch (error) {
        notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(`Failed to download file with ID ${fileID}`));
        console.error(`Failed to download file with ID ${fileID}`, error);
      }
    }

    const modifyResultNoColumn = (id, result) => {
      return <Button variant="link" style={{ color: '#047cab' }} onClick={() => openResultConfigSnapshots(result)}>{id}</Button>
    }

    const openResultConfigSnapshots = (result) => {
      if (result.configSnapshots === null || result.configSnapshots === undefined) {
        setModalResultConfigs({"configs": []})
        setModalResultConfigsIndex(result.id);
        setIsResultConfigDialogOpened(true);
      } else {
        setModalResultConfigs(result.configSnapshots)
        setModalResultConfigsIndex(result.id);
        setIsResultConfigDialogOpened(true);
      }
    }

    const handleNewResult = async (data) => {
      if(data) {
        const result = {
          scenarioId: scenario.id,
          description: data.value
        }
        try {
          await addResult({ result: result }).unwrap();
        } catch (err) {
          notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
        }
      }

      refetchResults();
      setIsNewDialogOpened(false);
    }

    const handleDeleteResult = async (isConfirmed) => {
      if(isConfirmed) {
        try {
          await deleteResult(resultToDelete.id).unwrap();
        } catch (err) {
          notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
        }
      }

      refetchResults();
      setIsDeleteModalOpened(false);
      setResultToDelete({});
    }
    
    return (
        <div>
          <h2 style={tableHeadingStyle}>Results
          <span className='icon-button'>
            <IconButton
              childKey={1}
              tooltip='Add Result'
              onClick={() => setIsNewDialogOpened(true)}
              icon='plus'
              disabled={scenario.isLocked}
              hidetooltip={scenario.isLocked}
              buttonStyle={buttonStyle}
              iconStyle={iconStyle}
            />
            </span>
          </h2>
  
          <Table data={results}>
            <DataColumn
              title='ID'
              dataKey='id'
              width={70}
              modifier={(id, result) => modifyResultNoColumn(id, result)}
            />
            <DataColumn
              title='Description'
              dataKey='description'
              width={300}
            />
            <DataColumn
              title='Created at'
              dataKey='createdAt'
              width={200}
            />
            <DataColumn
              title='Last update'
              dataKey='updatedAt'
              width={200}
            />
            <LinkbuttonColumn
              title='Files'
              dataKey='resultFileIDs'
              linkKey='filebuttons'
              data={files}
              onDownload={(fileID) => handleDownloadFile(fileID)}
              width={300}
            />
            <ButtonColumn
              width={200}
              align='right'
              editButton
              pythonResultsButton
              downloadAllButton
              deleteButton
              onPythonResults={(index) => {
                setIsPythonDialogOpened(true);
                setModalResultsIndex(index);
              }}
              onEdit={(index) => {}}
              onDownloadAll={(index) => handleDownloadAllFiles(index)}
              onDelete={(index) => {
                setIsDeleteModalOpened(true);
                setResultToDelete(results[index]);
              }}
              locked={scenario.isLocked}
            />
          </Table>
  
          {/* <EditResultDialog
            sessionToken={sessionToken}
            show={false}
            files={[]}
            results={results}
            resultId={0}
            scenarioID={scenario.id}
            onClose={() => {}}
          /> */}
          <DeleteDialog
            title="result"
            name={resultToDelete.id}
            show={isDeleteModalOpened}
            onClose={(e) => handleDeleteResult(e)}
          />
          <ResultConfigDialog
            show={isResultConfigDialogOpened}
            configs={modalResultConfigs}
            resultNo={modalResultConfigsIndex}
            onClose={() => setIsResultConfigDialogOpened(false)}
          />
          <ResultPythonDialog
            show={isPythonDialogOpened}
            files={files}
            results={results}
            resultId={modalResultsIndex}
            onClose={() => setIsPythonDialogOpened(false)}
          />
          <NewDialog
            show={isNewDialogOpened}
            title="New Result"
            inputLabel="Description"
            placeholder="Enter description"
            onClose={data => handleNewResult(data)}
          />
        </div>
      )
}

export default ResultsTable;
