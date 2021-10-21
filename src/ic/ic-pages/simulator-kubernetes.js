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
import IconButton from "../../common/buttons/icon-button";
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
    let rancherURL = ""
    let clusterName = ""

    // TODO take those from IC properties in raw statusupdate of manager IC
    if (props.config != null && props.config.kubernetes != null) {
      rancherURL = this.state.config.kubernetes["rancher-url"]
      clusterName = this.state.config.kubernetes["cluster-name"]
    }

    if (typeof props.rancherURL !== "undefined" && typeof clusterName !== "undefined"){
      let firstPart = "https://" + rancherURL + "/dashboard/c/" + clusterName + "/explorer";

      // raw properties of IC
      if (props.ic.statusupdateraw != null) {
        let icprops = props.ic.statusupdateraw.properties
        if(typeof icprops !== "undefined" && typeof icprops.namespace !== "undefined") {

          if (typeof icprops.job_name !== "undefined") {
            jobLink = firstPart + "/batch.job/" + icprops.namespace + "/" + icprops.job_name;
          }

          if (typeof icprops.pod_names !== "undefined") {
            for (let i=0; i<icprops.pod_names.length; i++) {
              podLinks.push(firstPart + "/pod/" + icprops.namespace + "/" + icprops.pod_names[i])
            }
          }
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
            onClick={() => refresh(this.props.ic, this.props.sessionToken)}
            icon='sync-alt'
            buttonStyle={this.props.buttonStyle}
            iconStyle={this.props.iconStyle}
          />
        </span>
      </h1>

      <div>
        <Row>
          <Col>
            <h4>Properties</h4>
            {ICParamsTable(this.props.ic)}
          </Col>
          <Col>
            <h4>Rancher UI</h4>
            <Table striped size="sm">
              <tbody>
                <tr><td></td></tr>
                {this.state.jobLink !== "" ?
                  <tr>
                    <td>Job</td>
                    <td><a href={this.state.jobLink}>{this.state.jobLink}</a></td>
                  </tr>:<></>}
                {this.state.podLinks !== [] && this.state.podLinks.map(link =>
                  <tr>
                    <td>Pod</td>
                    <td><a href={link}>{link}</a></td>
                  </tr>)}
              </tbody>
            </Table>
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col>
            <h4>Raw Status</h4>
            {rawDataTable(this.props.ic.statusupdateraw)}
          </Col>
        </Row>
      </div>
    </div>
    )
  }
}

export default KubernetesICPage;
