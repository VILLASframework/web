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
import IconButton from '../../common/buttons/icon-button';
import IconTextButton from '../../common/buttons/icon-text-button';
import ParametersEditor from '../../common/parameters-editor';
import ICAction from '../../ic/ic-action';
import ResultPythonDialog from "../../result/result-python-dialog";
import AppDispatcher from "../../common/app-dispatcher";

import { Container, Row, Col } from 'react-bootstrap';
import { playerMachine } from '../widget-player/player-machine';

import { interpret } from 'xstate';


const playerService = interpret(playerMachine);

function transitionState(currentState, playerEvent) {
  return playerMachine.transition(currentState, { type: playerEvent})
}


class WidgetPlayer extends Component {
  constructor(props) {
    super(props);
    //console.log("player constructor, service start")
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
      resultID: ''
    };
  }

  componentWillUnmount() {
    //console.log("player unmount, service stop")
    playerService.stop();
  }

  static getDerivedStateFromProps(props, state) {

    // configID was changed via edit control
    if (typeof props.widget.customProperties.configID !== "undefined"
      && state.configID !== props.widget.customProperties.configID) {
      //console.log("configID changed")
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
          //console.log(props.widget.customProperties.uploadResults)
          return {
            configID: configID,
            config: config,
            startParameters: config.startParameters,
            ic: playeric,
            icState: playeric.state,
            configBtnText: playeric.name,
            uploadResults: props.widget.customProperties.uploadResults,
            playerState: afterCreateState
          };
        } 
      }
    }

    // upload results was un-/checked via edit control
    if (props.widget.customProperties.uploadResults !== state.uploadResults) {
      //console.log("results checkbox changed")
      return { uploadResults: props.widget.customProperties.uploadResults }
    }

    // IC state changed
    if (state.ic && state.ic.state != state.icState) {
      //console.log("IC state changed")
      var newState;
      switch (state.ic.state) {
        case 'error':
          newState = transitionState(state.playerState, 'ERROR')
          return { playerState: newState, icState: state.ic.state }
        case 'stopping':
          AppDispatcher.dispatch({
            type: 'results/start-load',
            data: state.resultID,
            token: state.sessionToken,
          });
          newState = transitionState(state.playerState, 'FINISH')
          return { playerState: newState, icState: state.ic.state }
        case 'idle':
          newState = transitionState(state.playerState, 'RESETTED')
          return { playerState: newState, icState: state.ic.state }
        case 'starting':
          return { icState: state.ic.state }
        case 'running':
          newState = transitionState(state.playerState, 'STARTED')
          return { playerState: newState, icState: state.ic.state }
        default: // unexpected ic state change
          newState = transitionState(state.playerState, 'ERROR')
          return { playerState: newState, icState: state.ic.state }
        }
      }

    if (props.results && state.playerState && state.playerState.matches('finished')) {
      // TODO: show results
      //console.log(props.results[props.results.length - 1])
    }

    return {};
  }

  clickStart() {
    let newState = transitionState(this.state.playerState, 'START')
    if (newState.matches('starting')) {
      let config = this.state.config
      config.startParameters = this.state.startParameters
      ICAction.start([config], '{}', [this.state.ic], Date.now(), this.state.sessionToken, this.state.uploadResults)
    }
    this.setState({ playerState: newState })
  }

  clickReset() {
    ICAction.reset(this.state.ic.id, Date.now(), this.state.sessionToken)
    let newState = transitionState(this.state.playerState, 'RESET')
    this.setState({ playerState: newState })
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
              <p style={{marginTop: '8px', marginBottom: '0px', textAlign: 'center'}}>Results</p>
              <Row style={{marginTop: '0px'}}>
                <Col lg={{ span: 6 }}>
                  <span className='play-button'>
                    <IconButton
                      childKey={0}
                      onClick={() => this.setState({pythonResultsModal: true})}
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
                      onClick={() => console.log("TODO")}
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
        {!this.state.config ?
          <p> no config selected</p> : <></>
        }
        <ResultPythonDialog
          show={this.state.pythonResultsModal}
          files={this.props.files}
          results={this.props.results}
          resultId={this.state.modalResultsIndex}
          onClose={() => this.setState({pythonResultsModal: false})}
        />
      </div>
    );
  }
}

export default WidgetPlayer;
