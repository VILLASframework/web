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

import React from 'react';
import classNames from 'classnames';
import { Form, Row, Col } from 'react-bootstrap';
import AppDispatcher from "../common/app-dispatcher";
import DateTimePicker from 'react-datetime-picker';
import ICButtonGroup from "./ic-button-group";
import ICAction from "./ic-action";


Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
}

class ICActionBoard extends React.Component {
  constructor(props) {
    super(props);

    let time = new Date();
    time.setMinutes(5 * Math.round(time.getMinutes() / 5 + 1))

    this.state = {
      selectedAction: null,
      time: time,
      paused: false,
      timeIsValid: true,
      createResult: true,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.selectedAction == null) {
      if (props.actions != null && props.actions.length > 0) {
        return {
          selectedAction: props.actions[0]
        };
      }
    }

    return null
  }

  onReset = () => {
    this.props.selectedICs.forEach(selIC => {
      ICAction.reset(selIC.id, this.state.time, this.props.token)
    })
  }

  onShutdown = () => {
    this.props.selectedICs.forEach(selIC => {
      ICAction.shutdown(selIC.id, this.state.time, this.props.token)
    })
  }

  onDelete = () => {
    this.props.selectedICs.forEach(selIC => {
      let managerIC = this.props.ics.find(ic => ic.uuid === selIC.manager)
      if (typeof managerIC !== 'undefined') {
        ICAction.deleteIC(selIC, managerIC, this.state.time, this.props.token)
      }
    })
  }

  onRecreate = () => {
    this.props.selectedICs.forEach(selIC => {
      let managerIC = this.props.ics.find(ic => ic.uuid === selIC.manager)
      if (typeof managerIC !== 'undefined') {
        ICAction.recreate(selIC, managerIC, this.state.time, this.props.token)
      }
    })
  }

  onStart = () => {
    let configSnapshots = [];
    if (this.state.createResult) {
      this.props.selectedConfigs.forEach(config => {
        let index = this.props.configs.indexOf(config)
        configSnapshots.push(this.props.snapshotConfig(index));
      })
    }
    ICAction.start(this.props.selectedConfigs, configSnapshots, this.props.ics, this.state.time, this.props.token, this.state.createResult)
  }

  dispatchActionsForConfigs(actiontype) {
    let newActions = [];
    for (let config of this.props.selectedConfigs) {
      let newAction = {}
      newAction['action'] = actiontype
      newAction['when'] = this.state.time

      // get IC for component config
      let ic = null;
      for (let component of this.props.ics) {
        if (component.id === config.icID) {
          ic = component;
        }
      }

      if (ic == null) {
        continue;
      }

      // the following is not required by the protocol; it is an internal help
      newAction["icid"] = ic.id

      // add the new action
      newActions.push(newAction);
    }

    console.log("Dispatching actions for configs", newActions)
    AppDispatcher.dispatch({
      type: 'ics/start-action',
      action: newActions,
      result: null,
      token: this.props.token
    });
  }

  getICIDsForSelectedConfigs() {
    let icIDs = []
    this.props.selectedConfigs.forEach(config => {
      // get IC for component config
      let ic = null;
      this.props.ics.forEach(component => {
        if (component.id === config.icID) {
          ic = component;
        }
      })

      if (ic == null) {
        return;
      }
      icIDs.push(ic.id);  
    })

    return icIDs
  }

  onStop = () => {
    let icIDs = this.getICIDsForSelectedConfigs()
    ICAction.stop(icIDs, this.state.time, this.props.token)
    
    if (this.state.paused) {
      this.setState({ paused: false })
    }
  }

  onPauseResume = () => {
    let icIDs = this.getICIDsForSelectedConfigs()

    if (this.state.paused) {
      ICAction.resume(icIDs, this.state.time, this.props.token)
    } else {
      ICAction.pause(icIDs, this.state.time, this.props.token)
    }

    this.setState({ paused: !this.state.paused })
  }

  render() {
    let disabled = (this.props.configs
      ? this.props.selectedConfigs.length === 0
      : this.props.selectedICs.length === 0
    );

    const boxClasses = classNames('section', 'box', { 'fullscreen-padding': this.props.isFullscreen });
    return (<div className={boxClasses}>
      <Row className='align-items-center'>
        <Col style={{padding: '10px'}} md='auto' lg='auto'>
          <Form>
            <DateTimePicker
              onChange={(newTime) => this.setState({time: newTime})}
              value={this.state.time}
              disableClock={true}
              />
          </Form>
        </Col>
        <Col style={{padding: '20px'}} md='auto' lg='auto'>
          <ICButtonGroup
            disabled={disabled || !this.state.timeIsValid}
            onReset={this.props.doReset ? this.onReset : null}
            onShutdown={this.props.doShutdown ? this.onShutdown : null}
            onDelete={this.props.doDelete ? this.onDelete : null}
            onRecreate={this.props.doRecreate ? this.onRecreate : null}
            onStart={this.props.doStart ? this.onStart : null}
            onStop={this.props.doStop ? this.onStop : null}
            onPauseResume={this.props.doPauseResume ? this.onPauseResume : null}
            paused={this.state.paused}
          />
        </Col>
        {this.props.enableResultCheck ?
          <Col style={{padding: '20px'}} md='auto' lg='auto'>
            <Form.Group controlId="resultCheck">
              <Form.Check 
                type="checkbox" 
                label="Create Result"
                checked={this.state.createResult}
                onChange={() => this.setState(prevState => ({createResult: !prevState.createResult}))}
              />
            </Form.Group>
          </Col> : <></>
        }
      </Row>
      <small className="text-muted">Select time for synced command execution</small>
    </div>);
  }
}

export default ICActionBoard;
