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
import JSZip from 'jszip';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col,Form } from 'react-bootstrap';
import {sendActionToIC,loadICbyId} from "../../../../store/icSlice";
import { sessionToken } from '../../../../localStorage';
import IconButton from '../../../../common/buttons/icon-button';
import IconTextButton from '../../../../common/buttons/icon-text-button';
import ParametersEditor from '../../../../common/parameters-editor';
import ResultPythonDialog from '../../../scenarios/dialogs/result-python-dialog';
import { playerMachine } from '../widget-player/player-machine';
import { interpret } from 'xstate';
import { useAddResultMutation, useLazyDownloadFileQuery, useGetResultsQuery, useGetFilesQuery } from '../../../../store/apiSlice';
import notificationsDataManager from '../../../../common/data-managers/notifications-data-manager';
import NotificationsFactory from '../../../../common/data-managers/notifications-factory';
import { start } from 'xstate/lib/actions';
import FileSaver from "file-saver";
import { useDispatch } from 'react-redux';

const WidgetPlayer = (
  {widget, editing, configs, onStarted, ics, results, files, scenarioID}) => {
    const dispatch = useDispatch()
    const zip = new JSZip()
    const [triggerDownloadFile] = useLazyDownloadFileQuery();
    const {refetch: refetchResults} = useGetResultsQuery(scenarioID);
    const {refetch: refetchFiles} = useGetFilesQuery(scenarioID);
    const [addResult, {isError: isErrorAddingResult}] = useAddResultMutation();
    const [playerState, setPlayerState] = useState(playerMachine.initialState);
    const [configID, setConfigID] = useState(-1);
    const [config, setConfig] = useState({});
    const [icState, setICState] = useState("unknown");
    const [startParameters, setStartParameters] = useState({});
    const [playerIC, setPlayerIC] = useState({name: ""});
    const [showPythonModal, setShowPythonModal] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [isUploadResultsChecked, setIsUploadResultsChecked] = useState(widget.customProperties.uploadResults);
    const [resultArrayId, setResultArrayId] = useState(0);
    const [filesToDownload, setFilesToDownload] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    const [warningText, setWarningText] = useState("");
    const [configBtnText, setConfigBtnText] = useState("Component Configuration");

    const playerService = interpret(playerMachine);
    playerService.start();
    useEffect(()=>{
      setIsUploadResultsChecked(widget.customProperties.uploadResults)
    },[widget.customProperties.uploadResults])

    useEffect(()=>{
      if(playerIC.name.length !== 0){
        const refresh = async() => {
          const res = await dispatch(loadICbyId({id: playerIC.id, token:sessionToken}));
          setICState(res.payload.state)
        }
        const timer = window.setInterval(() => refresh(), 1000);
        return () => {
          window.clearInterval(timer);
        };
      }
    },[playerIC])
    
    useEffect(() => {
      if (typeof widget.customProperties.configID !== "undefined"
        && configID !== widget.customProperties.configID) {
          let configID = widget.customProperties.configID;
          let config = configs.find(cfg => cfg.id === parseInt(configID, 10));
          if (config) {
            let t_playeric = ics.find(ic => ic.id === parseInt(config.icID, 10));
            if (t_playeric) {
              var afterCreateState = '';
              if (t_playeric.state === 'idle') {
                afterCreateState = transitionState(playerState, 'ICIDLE');
              } else {
                afterCreateState = transitionState(playerState, 'ICBUSY');
              }
              setPlayerIC(t_playeric);
              setConfigID(configID);
              setPlayerState(afterCreateState);
              setConfig(config);
              setStartParameters(config.startParameters);
            }
          }
      }
    }, [configs,ics]);

    useEffect(() => {
      if (results && results.length != resultArrayId) {
        setResultArrayId(results.length - 1);
      }
    }, [results]);

    useEffect(() => {
        var newState = "";
        switch (icState) {
          case 'stopping': // if configured, show results
            if (isUploadResultsChecked) {
              refetchResults();
              refetchFiles().then(v=>{
              setFilesToDownload(v.data.files)
              });
            }
            newState = transitionState(playerState, 'FINISH')
            setPlayerState(newState);
            return { playerState: newState, icState: icState }
          case 'idle':
            newState = transitionState(playerState, 'ICIDLE')
            setPlayerState(newState);
            return { playerState: newState, icState: icState }
          default:
            if (icState === 'running') {
              onStarted()
            }
            newState = transitionState(playerState, 'ICBUSY')
            setPlayerState(newState);
            return { playerState: newState, icState: icState }
        }
    }, [icState]);

    const transitionState = (currentState, playerEvent) => {
      return playerMachine.transition(currentState, { type: playerEvent })
    }

    const clickStart = async () => {
      try {
          setPlayerState(transitionState(playerState, 'ICBUSY'));
          let pld = {action:"start",when:Math.round((new Date()).getTime() / 1000),parameters:{...config.startParameters}}
          if(isUploadResultsChecked){
            addResult({result: {
              scenarioID: scenarioID
            }})
            .then(v=>{
              pld.results = {
                url: `https://slew.k8s.eonerc.rwth-aachen.de/api/v2/results/${v.data.result.id}/file`,
                type: "url",
                token: sessionToken
              }
              dispatch(sendActionToIC({token:sessionToken,id:config.icID,actions:[pld]}))
            })
            .catch(e=>{
              notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(e.toString()));
            })
          }
          else{
            dispatch(sendActionToIC({token:sessionToken,id:config.icID,actions:[pld]}))
          }
        //sendAction({ icid: startConfig.icID, action: "start", when: Math.round((new Date()).getTime() / 1000), parameters: {...startParameters } }).unwrap();
      } catch(error) {
        notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(error?.data?.message));
      }
    }

    const clickReset = async () => {
      try {
        dispatch(sendActionToIC({token:sessionToken,id:config.icID,actions:[{action:"reset",when:Math.round((new Date()).getTime() / 1000)}]}))
        //sendAction({ icid: ic.id, action: "reset", when: Math.round((new Date()).getTime() / 1000), parameters: {...startParameters } }).unwrap();
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
      triggerDownloadFile(fileID)
      .then(v=>{
        const file = filesToDownload.find(f => f.id === fileID);
        const blob = new Blob([v.data], { type: 'application/octet-stream' });
        zip.file(file.name, blob);
        zip.generateAsync({ type: 'blob' })
        .then((content) => {
          FileSaver.saveAs(content, `result-${file.id}.zip`);
        })
        .catch((err) => {
          notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR('Failed to create ZIP archive'));
          console.error('Failed to create ZIP archive', err);
        });
      })
      .catch(e=>{
        notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(e));
      })
        
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
            <Row className="justify-content-md-center">
              <Col lg='auto'>
                <Form.Group controlId="resultCheck">
                  <Form.Check 
                    type="checkbox" 
                    label="Results"
                    checked={isUploadResultsChecked}
                    onChange={() => setIsUploadResultsChecked(prevState => !prevState)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {isUploadResultsChecked ?
              <div>
                <Row style={{ marginTop: '0px' }}>
                  <Col lg={{ span: 6 }}>
                    <span className='play-button'>
                      <IconButton
                        childKey={0}
                        onClick={() => openPythonDialog()}
                        icon={['fab', 'python']}
                        disabled={(playerState && playerState.matches('finished')&& isUploadResultsChecked) ? false : true}
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
                        disabled={(playerState && playerState.matches('finished') ) ? false : true}
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
              content={startParameters}
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
