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

    //should be configurable via the backend
    let rancher_url = "rancher.k8s.eonerc.rwth-aachen.de";
    let cluster_name = "local";

    //! statusupdateraw properties only placeholders, not the right property names 
    if(typeof props.statusupdateraw !== "undefined" && typeof props.statusupdateraw.namespace !== "undefined"){

        let firstPart = "https://" + rancher_url + "/dashboard/c/" + cluster_name + "/explorer";

        if(typeof props.statusupdateraw.name !== "undefined"){
            jobLink = firstPart + "/batch.job/" + props.statusupdateraw.namespace + "/" + props.statusupdateraw.job_name;
        }

        if(typeof props.statusupdateraw.pod_names !== []){
          props.statusupdateraw.pod_names.map(name => (
            podLinks.push(firstPart + "/pod/" + props.statusupdateraw.namespace + "/" + name)
          ))
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
