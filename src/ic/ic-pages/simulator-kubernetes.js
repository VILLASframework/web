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
import IconButton from "../../common/icon-button";
import {Col, Container, Row, Table} from "react-bootstrap";
import { refresh, ICParamsTable, rawDataTable } from "../ic"

class KubernetesICPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        jobLink: "",
        podLinks: []
      };
  }

  static getDerivedStateFromProps(props, state){

    let jobLink = "";
    let podLinks = [];

    if( typeof props.rancherURL !== "undefined" && typeof props.k8sCluster !== "undefined" ){
      let firstPart = "https://" + props.rancherURL + "/dashboard/c/" + props.k8sCluster + "/explorer";

      // raw properties of IC
      let ICproperties = props.ic.statusupdateraw.properties
      if(typeof ICproperties !== "undefined" && typeof ICproperties.namespace !== "undefined"){

        if(typeof ICproperties.job_name !== "undefined"){
          jobLink = firstPart + "/batch.job/" + ICproperties.namespace + "/" + ICproperties.job_name;
        } else if (typeof ICproperties.pod_names !== "undefined" && ICproperties.pod_names !== []){
          ICproperties.pod_names.map(name => (
            podLinks.push(firstPart + "/pod/" + ICproperties.namespace + "/" + name)
          ))
        }
      }
    }

    return {
        jobLink: jobLink,
        podLinks: podLinks
      };
  }

  render() {
    return (<div className='section'>

      <h1>{this.props.ic.name}
        <span className='icon-button'>

          <IconButton
            childKey={2}
            tooltip='Refresh'
            onClick={() => this.props.refresh(this.props.ic, this.props.sessionToken)}
            icon='sync-alt'
            buttonStyle={this.props.buttonStyle}
            iconStyle={this.props.iconStyle}
          />
        </span>
      </h1>

      <Container>
        <Row>
          <Table striped size="sm">
            <tbody>
            <tr><td>Rancher UI pages:</td></tr>
            {this.state.jobLink !== "" ?
            <tr><td>Job:</td><td>{this.state.jobLink}</td></tr>
            :
            <></>}
            {this.state.podLinks !== [] && this.state.podLinks.map(link =>
            <tr><td>Pod:</td><td>{link}</td></tr>
            )
            }
            </tbody>
          </Table>
        </Row>
        <Row>
          <Col>
            {ICParamsTable(this.props.ic)}
          </Col>
          <Col>
            <b>Raw Status</b>
            {rawDataTable(this.props.ic.statusupdateraw)}
          </Col>
        </Row>
      </Container>
    </div>
    )
  }

}

export default KubernetesICPage;
