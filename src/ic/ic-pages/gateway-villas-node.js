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
import {Button, Col, Container, Row} from "react-bootstrap";
import IconButton from "../../common/buttons/icon-button";
import ConfirmCommand from "../confirm-command";
import AppDispatcher from "../../common/app-dispatcher";
import { refresh, ICParamsTable, rawDataTable } from "../ic"

class GatewayVillasNode extends React.Component {

  constructor() {
    super();

    this.state = {
      confirmCommand: false,
      command: '',
    }
  }

  sendControlCommand() {
    if (this.state.command === "restart") {
      AppDispatcher.dispatch({
        type: 'ics/restart',
        url: this.props.ic.apiurl + "/restart",
        token: this.props.sessionToken,
      });
    } else if (this.state.command === "shutdown") {
      AppDispatcher.dispatch({
        type: 'ics/shutdown',
        url: this.props.ic.apiurl + "/shutdown",
        token: this.props.sessionToken,
      });
    }
  }

  confirmCommand(canceled){
    if(!canceled){
      this.sendControlCommand();
    }

    this.setState({confirmCommand: false, command: ''});
  }

  render() {

    return (<div className='section'>
      <h1>{this.props.ic.name}
        <span className='icon-button'>
          <IconButton
            childKey={2}
            tooltip='Refresh'
            onClick={() => refresh(this.props.ic, this.props.sessionToken)}
            icon='sync-alt'
            buttonStyle={this.props.buttonStyle}
            iconStyle={this.props.iconStyle}
          />
        </span>
      </h1>

      <Row>
        <Col>
          <h4>Properties</h4>
          {ICParamsTable(this.props.ic)}
        </Col>
        <Col>
          {this.props.currentUser.role === "Admin" ?
            <div>
              <h4>Controls</h4>
              <div className='solid-button'>
                <Button
                  variant='secondary'
                  style={{ margin: '5px' }}
                  size='lg'
                  onClick={() => this.setState({ confirmCommand: true, command: 'restart' })}>
                  Restart
                </Button>
                <Button
                  variant='secondary'
                  style={{ margin: '5px' }}
                  size='lg'
                  onClick={() => this.setState({ confirmCommand: true, command: 'shutdown' })}>
                  Shutdown
                </Button>
              </div>
            </div>
            : <div />
          }
          <ConfirmCommand
            show={this.state.confirmCommand}
            command={this.state.command}
            name={this.props.ic.name}
            onClose={c => this.confirmCommand(c)}
          />
        </Col>
      </Row>
      <hr/>
      <Row>
        <Col>
          <h4>Raw Status</h4>
          {rawDataTable(this.props.ic.statusupdateraw)}
        </Col>
        <Col>
          <h4>Raw Config</h4>
          {rawDataTable(this.props.ic.statusupdateraw != null ? this.props.ic.statusupdateraw.config : null )}
        </Col>
        <Col>
          <h4>Raw Statistics</h4>
          {rawDataTable(this.props.ic.statusupdateraw != null ? this.props.ic.statusupdateraw.statistics : null)}
        </Col>
      </Row>
    </div>)
  }
}

export default GatewayVillasNode;
