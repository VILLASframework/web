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

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import JSZip from 'jszip';
import IconButton from '../../../../common/buttons/icon-button';
import IconTextButton from '../../../../common/buttons/icon-text-button';
import ParametersEditor from '../../../../common/parameters-editor';
import ResultPythonDialog from '../../../scenarios/dialogs/result-python-dialog';
import { playerMachine } from '../widget-player/player-machine';
import { interpret } from 'xstate';
import { useSendActionMutation, useLazyDownloadFileQuery, useGetResultsQuery, useGetFilesQuery } from '../../../../store/apiSlice';
import notificationsDataManager from '../../../../common/data-managers/notifications-data-manager';
import NotificationsFactory from '../../../../common/data-managers/notifications-factory';
import { start } from 'xstate/lib/actions';

const WidgetPlayer = (
  {widget, editing, configs, onStarted, ics, results, files, scenarioID}) => {

    const [sendAction] = useSendActionMutation();
    const [triggerDownloadFile] = useLazyDownloadFileQuery();
    const {refetch: refetchResults} = useGetResultsQuery(scenarioID);
    const {refetch: refetchFiles} = useGetFilesQuery(scenarioID);


    const [playerState, setPlayerState] = useState(playerMachine.initialState);
    const [configID, setConfigID] = useState(-1);
    const [config, setConfig] = useState({});
    const [ic, setIC] = useState(null);
    const [icState, setICState] = useState("unknown");
    const [startParameters, setStartParameters] = useState({});
    const [playerIC, setPlayerIC] = useState({name: ""});
    const [showPythonModal, setShowPythonModal] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [isUploadResultsChecked, setIsUploadResultsChecked] = useState(false);
    const [resultArrayId, setResultArrayId] = useState(0);
    const [filesToDownload, setFilesToDownload] = useState([]);

    const [showWarning, setShowWarning] = useState(false);
    const [warningText, setWarningText] = useState("");
    const [configBtnText, setConfigBtnText] = useState("Component Configuration");

    const playerService = interpret(playerMachine);
    playerService.start();

    useEffect(() => {
      if (typeof widget.customProperties.configID !== "undefined"
        && configID !== widget.customProperties.configID) {
          let configID = widget.customProperties.configID;
          let config = configs.find(cfg => cfg.id === parseInt(configID, 10));
          if (config) {
            let playeric = ics.find(ic => ic.id === parseInt(config.icID, 10));
            if (playeric) {
              var afterCreateState = '';
              if (playeric.state === 'idle') {
                afterCreateState = transitionState(playerState, 'ICIDLE');
              } else {
                afterCreateState = transitionState(playerState, 'ICBUSY');
              }
              
              setPlayerIC(playeric);
              setConfigID(configID);
              setPlayerState(afterCreateState);
              setConfig(config);
              setStartParameters(config.startParameters);
            }
          }
      }
    }, [configs]);

    useEffect(() => {
      if (results && results.length != resultArrayId) {
        setResultArrayId(results.length - 1);
      }
    }, [results]);

    useEffect(() => {
      if (ic && ic?.state != icState){
        var newState = "";
        switch (ic.state) {
          case 'stopping': // if configured, show results
            if (isUploadResultsChecked) {
              refetchResults();
              refetchFiles();
            }
            newState = transitionState(playerState, 'FINISH')
            return { playerState: newState, icState: ic.state }
          case 'idle':
            newState = transitionState(playerState, 'ICIDLE')
            return { playerState: newState, icState: ic.state }
          default:
            if (ic.state === 'running') {
              onStarted()
            }
            newState = transitionState(playerState, 'ICBUSY')
            return { playerState: newState, icState: ic.state }
        }
      }
    }, [icState]);

    const transitionState = (currentState, playerEvent) => {
      return playerMachine.transition(currentState, { type: playerEvent })
    }

    const clickStart = async () => {
      const startConfig = { ...config };
      startConfig.startParameters = startParameters;
      
      try {
        sendAction({ icid: startConfig.icID, action: "start", when: Math.round((new Date()).getTime() / 1000), parameters: {...startParameters } }).unwrap();
      } catch(error) {
        notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(error?.data?.message));
      }
      
      setPlayerState(transitionState(playerState, 'START'));
    }

    const clickReset = async () => {
      try {
        sendAction({ icid: ic.id, action: "reset", when: Math.round((new Date()).getTime() / 1000), parameters: {...startParameters } }).unwrap();
      } catch(error) {
        notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(error?.data?.message));
        console.log(error);
      }
    }

    const downloadResultFiles = () => {
      if (results.length <= resultArrayId) {
        setShowWarning(true);
        setWarningText('no new result');
        return;
      }

      const result = results[resultArrayId];
      const toDownload = result.resultFileIDs;

      if(toDownload.length <= 0){
        setShowWarning(true);
        setWarningText('no result files');
      } else {
        toDownload.forEach(fileID => handleDownloadFile(fileID))
      }

      setFilesToDownload(toDownload);

    }

    const handleDownloadFile = async (fileID) => {
      try {
        const res = await triggerDownloadFile(fileID);
        const file = files.find(f => f.id === fileID);
        const blob = new Blob([res], { type: 'application/octet-stream' });
        zip.file(file.name, blob);
      } catch (error) {
        notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(error?.data?.message));
      }
    }

    const openPythonDialog = () => {
      if (results.length <= resultArrayId) {
        setShowWarning(true);
        setWarningText('no new result');
        return;
      }
  
      setShowPythonModal(true);
    }

    const iconStyle = {
      height: '20px',
      width: '20px'
    }

    let configButton = {
      height: '70px',
      width: '120px',
      fontSize: '13px'
    }

    return (
      <div>
        <div className="player">
          <Container>
            <Row className="justify-content-md-center">
              <Col lg={{ span: 6 }}>
                <span className='play-button'>
                  <IconButton
                    childKey={0}
                    onClick={() => clickStart()}
                    icon='play'
                    disabled={!(playerState && playerState.matches('startable'))}
                    iconStyle={iconStyle}
                    tooltip='Start Component'
                  />
                </span>
              </Col>
              <Col lg={{ span: 6 }}>
                <span className='play-button'>
                  <IconButton
                    childKey="0"
                    onClick={() => clickReset()}
                    icon='undo'
                    iconStyle={iconStyle}
                    tooltip='Reset Component'
                  />
                </span>
              </Col>
            </Row>

            <Row className="justify-content-md-center">
              <Col lg={12}>
                <span className='config-button'>
                  <IconTextButton
                    className='play-button'
                    onClick={() => setShowConfig(prevState => (!prevState))}
                    icon='cogs'
                    text={configBtnText + ' '}
                    buttonStyle={configButton}
                    disabled={false}
                    tooltip='Open/Close Component Configuration'
                  />
                </span>
              </Col>
            </Row>

            {isUploadResultsChecked ?
              <div>
                <p style={{ marginTop: '8px', marginBottom: '0px', textAlign: 'center' }}>Results</p>
                <Row style={{ marginTop: '0px' }}>
                  <Col lg={{ span: 6 }}>
                    <span className='play-button'>
                      <IconButton
                        childKey={0}
                        onClick={() => openPythonDialog()}
                        icon={['fab', 'python']}
                        disabled={(playerState && playerState.matches('finished')) ? false : true}
                        iconStyle={iconStyle}
                      />
                    </span>
                  </Col>
                  <Col lg={{ span: 6 }}>
                    <span className='play-button'>
                      <IconButton
                        childKey={1}
                        onClick={() => downloadResultFiles()}
                        icon='file-download'
                        disabled={(playerState && playerState.matches('finished')) ? false : true}
                        iconStyle={iconStyle}
                      />
                    </span>
                  </Col>
                </Row>
              </div>
              : <></>
            }
          </Container>


        </div>
        {showConfig && config ?
          <div className="config-box">
            <ParametersEditor
              content={config}
              onChange={(data) => setStartParameters(data)}
            /></div>
          : <></>
        }
        {showWarning ?
          <p>{warningText}</p> : <></>
        }
        {isUploadResultsChecked ?
          <ResultPythonDialog
            show={showPythonModal}
            files={files}
            results={results}
            resultId={resultArrayId}
            onClose={() => setShowPythonModal(false)}
          /> : <></>
        }
      </div>
    );
}

export default WidgetPlayer;
