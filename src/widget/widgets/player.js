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

import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import JSZip from 'jszip';

import IconButton from '../../common/buttons/icon-button';
import IconTextButton from '../../common/buttons/icon-text-button';
import ParametersEditor from '../../common/parameters-editor';
import ICAction from '../../ic/ic-action';
import ResultPythonDialog from "../../pages/scenarios/dialogs/result-python-dialog";
import AppDispatcher from "../../common/app-dispatcher";

import { playerMachine } from '../widget-player/player-machine';
import { interpret } from 'xstate';


const playerService = interpret(playerMachine);

function transitionState(currentState, playerEvent) {
  return playerMachine.transition(currentState, { type: playerEvent })
}


class WidgetPlayer extends Component {
  constructor(props) {
    super(props);

    playerService.start();

    this.state = {
      showDialog: false,
      configID: '',
      config: null,
      playerState: playerMachine.initialState,
      showConfig: false,
      startParameters: {},
      icState: 'unknown',
      ic: null,
      configBtnText: 'Component Configuration',
      uploadResults: false,
      sessionToken: localStorage.getItem("token"),
      pythonResultsModal: false,
      resultArrayId: 0,
      filesToDownload: [],
      showWarning: true,
      warningText: 'no config selected'
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.results && this.props.results.length - 1 !== this.state.resultArrayId) {
      this.setState({ resultArrayId: this.props.results.length - 1 });
    }
    // zip download files
    if (this.state.filesToDownload && this.state.filesToDownload.length > 0) {
      if (this.props.files !== prevProps.files) {
        let filesToDownload = this.props.files.filter(file => this.state.filesToDownload.includes(file.id) && file.data);

        if (filesToDownload.length === this.state.filesToDownload.length) { // all requested files have been loaded
          var zip = new JSZip();
          filesToDownload.forEach(file => {
            zip.file(file.name, file.data);
          });
          let zipname = "results_" + (new Date()).toISOString();
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, zipname);
          });
          this.setState({ filesToDownload: [] });
        }
      }
    }
  }

  componentWillUnmount() {
    playerService.stop();
  }

  static getDerivedStateFromProps(props, state) {

    // configID was changed via edit control
    if (typeof props.widget.customProperties.configID !== "undefined"
      && state.configID !== props.widget.customProperties.configID) {
      let configID = props.widget.customProperties.configID
      let config = props.configs.find(cfg => cfg.id === parseInt(configID, 10));
      if (config) {
        let playeric = props.ics.find(ic => ic.id === parseInt(config.icID, 10))
        if (playeric) {
          var afterCreateState = ''
          if (playeric.state === 'idle') {
            afterCreateState = transitionState(state.playerState, 'ICIDLE')
          } else {
            afterCreateState = transitionState(state.playerState, 'ICBUSY')
          }
          return {
            configID: configID,
            config: config,
            startParameters: config.startParameters,
            ic: playeric,
            icState: playeric.state,
            configBtnText: playeric.name,
            uploadResults: props.widget.customProperties.uploadResults,
            playerState: afterCreateState,
            showWarning: false,
            warningText: ''
          };
        }
      }
    }

    // upload results was un-/checked via edit control
    if (props.widget.customProperties.uploadResults !== state.uploadResults) {
      return { uploadResults: props.widget.customProperties.uploadResults }
    }

    // IC state changed
    if (state.ic && state.ic.state != state.icState) {
      var newState;
      switch (state.ic.state) {
        case 'stopping': // if configured, show results
          if (state.uploadResults) {
            AppDispatcher.dispatch({
              type: 'results/start-load',
              param: '?scenarioID=' + props.scenarioID,
              token: state.sessionToken,
            })

            AppDispatcher.dispatch({
              type: 'files/start-load',
              token: state.sessionToken,
              param: '?scenarioID=' + props.scenarioID,
            });
          }
          newState = transitionState(state.playerState, 'FINISH')
          return { playerState: newState, icState: state.ic.state }
        case 'idle':
          newState = transitionState(state.playerState, 'ICIDLE')
          return { playerState: newState, icState: state.ic.state }
        default:
          if (state.ic.state === 'running') {
            props.onStarted()
          }
          newState = transitionState(state.playerState, 'ICBUSY')
          return { playerState: newState, icState: state.ic.state }
      }
    }

    return {};
  }

  clickStart() {
    let config = this.state.config
    config.startParameters = this.state.startParameters
    ICAction.start([config], '{}', [this.state.ic], new Date(), this.state.sessionToken, this.state.uploadResults)

    let newState = transitionState(this.state.playerState, 'START')
    this.setState({ playerState: newState })
  }

  clickReset() {
    ICAction.reset(this.state.ic.id, new Date(), this.state.sessionToken)
  }

  openPythonDialog() {
    if (this.props.results.length <= this.state.resultArrayId) {
      this.setState({ showWarning: true, warningText: 'no new result' });
      return
    }

    this.setState({ pythonResultsModal: true })
  }

  downloadResultFiles() {
    if (this.props.results.length <= this.state.resultArrayId) {
      this.setState({ showWarning: true, warningText: 'no new result' });
      return
    }

    let result = this.props.results[this.state.resultArrayId]
    let toDownload = result.resultFileIDs;

    if (toDownload.length <= 0) {
      this.setState({ showWarning: true, warningText: 'no result files' });
      return
    }

    toDownload.forEach(fileid => {
      AppDispatcher.dispatch({
        type: 'files/start-download',
        data: fileid,
        token: this.state.sessionToken
      });
    });

    this.setState({ filesToDownload: toDownload });
  }

  render() {

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
                    onClick={() => this.clickStart()}
                    icon='play'
                    disabled={(this.state.playerState && this.state.playerState.matches('startable')) ? false : true}
                    iconStyle={iconStyle}
                    tooltip='Start Component'
                  />
                </span>
              </Col>
              <Col lg={{ span: 6 }}>
                <span className='play-button'>
                  <IconButton
                    childKey="0"
                    onClick={() => this.clickReset()}
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
                    onClick={() => this.setState(prevState => ({ showConfig: !prevState.showConfig }))}
                    icon='cogs'
                    text={this.state.configBtnText + ' '}
                    buttonStyle={configButton}
                    disabled={false}
                    tooltip='Open/Close Component Configuration'
                  />
                </span>
              </Col>
            </Row>

            {this.state.uploadResults ?
              <div>
                <p style={{ marginTop: '8px', marginBottom: '0px', textAlign: 'center' }}>Results</p>
                <Row style={{ marginTop: '0px' }}>
                  <Col lg={{ span: 6 }}>
                    <span className='play-button'>
                      <IconButton
                        childKey={0}
                        onClick={() => this.openPythonDialog()}
                        icon={['fab', 'python']}
                        disabled={(this.state.playerState && this.state.playerState.matches('finished')) ? false : true}
                        iconStyle={iconStyle}
                      />
                    </span>
                  </Col>
                  <Col lg={{ span: 6 }}>
                    <span className='play-button'>
                      <IconButton
                        childKey={1}
                        onClick={() => this.downloadResultFiles()}
                        icon='file-download'
                        disabled={(this.state.playerState && this.state.playerState.matches('finished')) ? false : true}
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
        {this.state.showConfig && this.state.config ?
          <div className="config-box">
            <ParametersEditor
              content={this.state.startParameters}
              onChange={(data) => this.setState({ startParameters: data })}
            /></div>
          : <></>
        }
        {this.state.showWarning ?
          <p>{this.state.warningText}</p> : <></>
        }
        {this.state.uploadResults ?
          <ResultPythonDialog
            show={this.state.pythonResultsModal}
            files={this.props.files}
            results={this.props.results}
            resultId={this.state.resultArrayId}
            onClose={() => this.setState({ pythonResultsModal: false })}
          /> : <></>
        }
      </div>
    );
  }
}

export default WidgetPlayer;
