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
import InfrastructureComponentStore from './ic-store';
import { Container as FluxContainer } from 'flux/utils';
import AppDispatcher from '../common/app-dispatcher';
import { Container, Col, Row, Table, Button } from 'react-bootstrap';
import moment from 'moment';
import ReactJson from 'react-json-view';
import ConfirmCommand from './confirm-command';
import Icon from "../common/icon";



class InfrastructureComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            confirmCommand: false,
            command: '',
        };
    }

    static getStores() {
        return [InfrastructureComponentStore];
    }

    static calculateState(prevState, props) {
        if (prevState == null) {
            prevState = {};
          }

        return {
            sessionToken: localStorage.getItem("token"),
            currentUser: JSON.parse(localStorage.getItem("currentUser")),
            ic: InfrastructureComponentStore.getState().find(ic => ic.id === parseInt(props.match.params.ic, 10))
        }
    }

    componentDidMount() {
        let icID = parseInt(this.props.match.params.ic, 10);

        AppDispatcher.dispatch({
            type: 'ics/start-load',
            data: icID,
            token: this.state.sessionToken,
        });

      // Start timer for periodic refresh
      this.timer = window.setInterval(() => this.refresh(), 10000);
    }

    refresh() {

        let icID = parseInt(this.props.match.params.ic, 10);
        AppDispatcher.dispatch({
          type: 'ics/start-load',
          token: this.state.sessionToken,
          data: icID
        });

        // get status of VILLASnode and VILLASrelay ICs
        if ((this.state.ic.type === "villas-node" || this.state.ic.type === "villas-relay")
          && this.state.ic.apiurl !== '' && this.state.ic.apiurl !== undefined && this.state.ic.apiurl !== null && !this.state.ic.managedexternally) {
          AppDispatcher.dispatch({
            type: 'ics/get-status',
            url: this.state.ic.apiurl,
            token: this.state.sessionToken,
            ic: this.state.ic
          });
        }

    }

    isJSON(data) {
        if (data === undefined || data === null) {
            return false;
        }
        let str = JSON.stringify(data);
        try {
            JSON.parse(str)
        }
        catch (ex) {
            return false
        }
        return true
    }

    async downloadGraph(url) {
        let blob = await fetch(url).then(r => r.blob())
        FileSaver.saveAs(blob, this.state.ic.name + ".svg");
    }

    sendControlCommand() {
        if (this.state.command === "restart") {
            AppDispatcher.dispatch({
                type: 'ics/restart',
                url: this.state.ic.apiurl + "/restart",
                token: this.state.sessionToken,
            });
        } else if (this.state.command === "shutdown") {
            AppDispatcher.dispatch({
                type: 'ics/shutdown',
                url: this.state.ic.apiurl + "/shutdown",
                token: this.state.sessionToken,
            });
        }
    }

    confirmCommand(canceled){
        if(!canceled){
          this.sendControlCommand();
        }

        this.setState({confirmCommand: false, command: ''});
      }

      async downloadGraph(url) {

        let blob = await fetch(url).then(r => r.blob())
        FileSaver.saveAs(blob, this.props.ic.name + ".svg");
      }

    render() {
        if (this.state.ic === undefined) {
            return <h1>Loading Infrastructure Component...</h1>;
        }

        let graphURL = ""
        if (this.state.ic.apiurl !== "") {
            graphURL = this.state.ic.apiurl + "/graph.svg"
        }

        return <div className='section'>
            <h1>{this.state.ic.name}</h1>
            <Container>
                <Row>
                    <Col>
                        <Table striped size="sm">
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td>{this.state.ic.name}</td>
                                </tr>
                                <tr>
                                    <td>Description</td>
                                    <td>{this.state.ic.description}</td>
                                </tr>
                                <tr>
                                    <td>UUID</td>
                                    <td>{this.state.ic.uuid}</td>
                                </tr>
                                <tr>
                                    <td>State</td>
                                    <td>{this.state.ic.state}</td>
                                </tr>
                                <tr>
                                    <td>Category</td>
                                    <td>{this.state.ic.category}</td>
                                </tr>
                                <tr>
                                    <td>Type</td>
                                    <td>{this.state.ic.type}</td>
                                </tr>
                                <tr>
                                    <td>Uptime</td>
                                    <td>{moment.duration(this.state.ic.uptime, "seconds").humanize()}</td>
                                </tr>
                                <tr>
                                    <td>Location</td>
                                    <td>{this.state.ic.location}</td>
                                </tr>
                                <tr>
                                    <td>Websocket URL</td>
                                    <td>{this.state.ic.websocketurl}</td>
                                </tr>
                                <tr>
                                    <td>API URL</td>
                                    <td>{this.state.ic.apiurl}</td>
                                </tr>
                                <tr>
                                    <td>Start parameter schema</td>
                                    <td>
                                      {this.isJSON(this.state.ic.startparameterschema) ?
                                      <ReactJson
                                            src={this.state.ic.startparameterschema}
                                            name={false}
                                            displayDataTypes={false}
                                            displayObjectSize={false}
                                            enableClipboard={false}
                                            collapsed={0}
                                        /> : <div>No Start parameter schema JSON available.</div>}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col><b>Raw Status</b>
                        {this.isJSON(this.state.ic.statusupdateraw) ?
                            <ReactJson
                                src={this.state.ic.statusupdateraw}
                                name={false}
                                displayDataTypes={false}
                                displayObjectSize={false}
                                enableClipboard={false}
                                collapsed={0}
                            /> : <div>No valid JSON raw data available.</div>}

                        {this.state.ic.type === "villas-node" ?
                            <>
                                <div className='section-buttons-group-right'>
                                    <Button style={{ margin: '5px' }} size='sm' onClick={() => this.downloadGraph(graphURL)}><Icon
                                        icon="download" /></Button>
                                </div>
                                <hr></hr>
                                <b>Graph:</b>
                                <div>
                                    <img alt={"Graph image download failed and/or incorrect image API URL"} src={graphURL} />
                                </div>

                                {this.state.currentUser.role === "Admin" ?
                                    <div>
                                        <hr></hr>
                                        <b>Controls:</b>
                                        <div className='solid-button'>
                                            <Button variant='secondary' style={{ margin: '5px' }} size='lg'
                                                onClick={() => this.setState({ confirmCommand: true, command: 'restart' })}>Restart</Button>
                                            <Button variant='secondary' style={{ margin: '5px' }} size='lg' onClick={() => this.setState({
                                                confirmCommand: true,
                                                command: 'shutdown'
                                            })}>Shutdown</Button>
                                        </div>
                                    </div>
                                    : <div />
                                }
                                <ConfirmCommand show={this.state.confirmCommand} command={this.state.command} name={this.state.ic.name}
                                    onClose={c => this.confirmCommand(c)} />
                            </>
                            : <div />}

                    </Col>
                </Row>
            </Container>
        </div>;
    }

}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default FluxContainer.create(fluxContainerConverter.convert(InfrastructureComponent), { withProps: true });
