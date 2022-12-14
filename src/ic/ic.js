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
import ICstore from './ic-store';
import ICdataStore from './ic-data-store'
import LoginStore from '../user/login-store'
import { Container as FluxContainer } from 'flux/utils';
import AppDispatcher from '../common/app-dispatcher';
import { Table, } from 'react-bootstrap';
import moment from 'moment';
import ReactJson from 'react-json-view';
import GatewayVillasNode from './ic-pages/gateway-villas-node'
import ManagerVillasNode from './ic-pages/manager-villas-node'
import ManagerVillasRelay from './ic-pages/manager-villas-relay'
import DefaultICPage from './ic-pages/default-page'
import DefaultManagerPage from './ic-pages/default-manager-page'
import KubernetesICPage from './ic-pages/simulator-kubernetes'

class InfrastructureComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: localStorage.getItem("token"),
      currentUser: JSON.parse(localStorage.getItem("currentUser")),
    };
  }

  static getStores() {
    return [ICstore, ICdataStore, LoginStore];
  }

  static calculateState(prevState, props) {
    return {
      ics: ICstore.getState(),
      ic: ICstore.getState().find(ic => ic.id === parseInt(props.match.params.ic, 10)),
      config: LoginStore.getState().config
    }
  }

  componentDidMount() {
    let icID = parseInt(this.props.match.params.ic, 10);

    AppDispatcher.dispatch({
      type: 'ics/start-load',
      token: this.state.sessionToken,
    });

    AppDispatcher.dispatch({
      type: 'ics/start-load',
      data: icID,
      token: this.state.sessionToken,
    });

    AppDispatcher.dispatch({
      type: 'config/load',
    });
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS){

    let icID = parseInt(this.props.match.params.ic, 10);

    if(typeof prevState !== "undefined" && typeof prevState.ic !== "undefined" && parseInt(prevState.ic.id, 10) !== icID){
      this.setState({ ic: ICstore.getState().find(ic => ic.id === icID)});
    }

  }

  static refresh(ic, token) {
    AppDispatcher.dispatch({
      type: 'ics/start-load',
      data: ic.id,
      token: token,
    });
  }

  static isJSON(data) {
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

  static rawDataTable(rawData){
    if(rawData !== null && InfrastructureComponent.isJSON(rawData)){
      return (
        <ReactJson
          src={rawData}
          name={false}
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={false}
          collapsed={1}
        />
      )
    } else {
      return (
        <div>No valid JSON raw data available.</div>
      )
    }
  }

  static ICParamsTable(ic) {
    let state = ic.state;

    return (
      <Table striped size="sm">
        <thead>
          <tr><th>Property</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{ic.name}</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{ic.description}</td>
          </tr>
          <tr>
            <td>UUID</td
            ><td>{ic.uuid}</td>
          </tr>
          <tr>
            <td>State</td>
            <td>{state}</td>
          </tr>
          <tr>
            <td>Category</td>
            <td>{ic.category}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{ic.type}</td>
          </tr>
          <tr>
            <td>Uptime</td>
            <td>{moment.duration(ic.uptime, "seconds").humanize()}</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>{ic.location}</td>
          </tr>
          <tr>
            <td>Websocket URL</td>
            <td>{ic.websocketurl}</td>
          </tr>
          <tr>
            <td>API URL</td>
            <td>{ic.apiurl}</td>
          </tr>
          <tr>
            <td>Start parameter schema</td>
            <td>
              {InfrastructureComponent.isJSON(ic.startparameterschema) ?
                <ReactJson
                  src={ic.startparameterschema}
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
    )
  }

  render() {
    if (this.state.ic === undefined) {
      return <h1>Loading Infrastructure Component...</h1>;
    }

    const buttonStyle = {
      marginLeft: '5px',
    }

    const iconStyle = {
      height: '25px',
      width: '25px'
    }

    if (this.state.ic.category ==="gateway" && this.state.ic.type === "villas-node")  {
      return <GatewayVillasNode
        ic = {this.state.ic}
        currentUser = {this.state.currentUser}
        sessionToken = {this.state.sessionToken}
        buttonStyle = {buttonStyle}
        iconStyle = {iconStyle}
      />
    } else if (this.state.ic.category ==="manager" && this.state.ic.type === "villas-node") {
      return <ManagerVillasNode
        ic = {this.state.ic}
        ics = {this.state.ics}
        currentUser = {this.state.currentUser}
        sessionToken = {this.state.sessionToken}
        buttonStyle = {buttonStyle}
        iconStyle = {iconStyle}
      />
    } else if (this.state.ic.category ==="manager" && this.state.ic.type === "villas-relay") {
      return <ManagerVillasRelay
        ic = {this.state.ic}
        ics = {this.state.ics}
        currentUser = {this.state.currentUser}
        sessionToken = {this.state.sessionToken}
        buttonStyle = {buttonStyle}
        iconStyle = {iconStyle}
      />
    } else if (this.state.ic.category ==="manager") {
      return <DefaultManagerPage
        ic = {this.state.ic}
        ics = {this.state.ics}
        currentUser = {this.state.currentUser}
        sessionToken = {this.state.sessionToken}
        buttonStyle = {buttonStyle}
        iconStyle = {iconStyle}
      />
    } else if (this.state.ic.category === "simulator" && this.state.ic.type === "kubernetes") {
      return <KubernetesICPage
        ic={this.state.ic}
        ics={this.state.ics}
        config={this.state.config}
        currentUser={this.state.currentUser}
        sessionToken={this.state.sessionToken}
        buttonStyle={buttonStyle}
        iconStyle={iconStyle}
      />
    } else {
      return <DefaultICPage
        ic = {this.state.ic}
        sessionToken = {this.state.sessionToken}
        buttonStyle = {buttonStyle}
        iconStyle = {iconStyle}
      />
    }
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default FluxContainer.create(fluxContainerConverter.convert(InfrastructureComponent), { withProps: true });
export const refresh = InfrastructureComponent.refresh;
export const ICParamsTable = InfrastructureComponent.ICParamsTable;
export const rawDataTable = InfrastructureComponent.rawDataTable;
