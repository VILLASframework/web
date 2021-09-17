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
import NotificationsFactory from "../common/data-managers/notifications-factory";
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";
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
      time: time.toString(),
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
    this.props.selectedICs.forEach(index => {
      let ic = this.props.ics[index];
      ICAction.reset(ic.id, this.state.time, this.props.token)
    })
  }

  onShutdown = () => {
    this.props.selectedICs.forEach(index => {
      let ic = this.props.ics[index];
      ICAction.shutdown(ic.id, this.state.time, this.props.token)
    })
  }

  onDelete = () => {
    this.props.selectedICs.forEach(index => {
      let ic = this.props.ics[index];
      let managerIC = null;
      for (let i of this.props.ics) {
        if (i.uuid === ic.manager) {
          managerIC = i;
        }
      }
      ICAction.deleteIC(ic, managerIC, this.state.time, this.props.token)
    })
  }

  onRecreate = () => {
    this.props.selectedICs.forEach(index => {
      let ic = this.props.ics[index];
      let managerIC = null;
      for (let i of this.props.ics) {
        if (i.uuid === ic.manager) {
          managerIC = i;
        }
      }
      ICAction.recreate(ic, managerIC, this.state.time, this.props.token)
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

  setTimeForAction = (event) => {
    console.log(event)
    let newTime = new Date(event.target.value)
    console.log(newTime)
    if (newTime instanceof Date && !isNaN(newTime)) {
      console.log("valid date")
      console.log(newTime)
      this.setState({ time: newTime.toString(), timeIsValid: true })
    } else {
      console.log("invalid date")
      this.setState({ time: event.target.value, timeIsValid: false })
    }
  }

  render() {
    let disabled = (this.props.configs
      ? this.props.selectedConfigs.length === 0
      : this.props.selectedICs.length === 0
    );

    const boxClasses = classNames('section', 'box', { 'fullscreen-padding': this.props.isFullscreen });
    return (<div className={boxClasses}>
      <Row md={8} lg={8}>
        <Col md={3} lg={3}>
          <Form>
          {/*<Form.Group controlId="time">*/}
            <Form.Control
              type="text"
              value={this.state.time}
              onChange={this.setTimeForAction}
            />
            {/*</Form.Group>*/}
          </Form>
        </Col>
        <Col lg={2}>
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
          <Col lg={2}>
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
