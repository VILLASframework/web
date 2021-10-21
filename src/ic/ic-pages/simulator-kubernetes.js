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
        jobLink: null,
        podLinks: []
      };
  }

  static getDerivedStateFromProps(props, state){

    let namespace = null;
    let jobName = null;
    let podNames = [];
    let clusterName = null;
    let rancherURL = null;

    let managerIC = props.ics.find(ic => ic.uuid === props.ic.manager);

    // Take k8s cluster details from managers status update
    if (managerIC != null) {
      let managerProps = managerIC.statusupdateraw.properties;

      if (managerProps != null) {
        rancherURL = managerProps.rancher_url;
        clusterName = managerProps.cluster_name;
      }
    }

    // Fallback to backend config
    if (props.config != null && props.config.kubernetes != null) {
      let k8s = props.config.kubernetes;
      if (k8s != null) {
        if (rancherURL == null) {
          rancherURL = k8s.rancher_url
        }

        if (clusterName == null) {
          clusterName = k8s.cluster_name
        }
      }
    }

    if (rancherURL != null && clusterName != null) {
      // raw properties of IC
      if (props.ic.statusupdateraw != null) {
        let icProps = props.ic.statusupdateraw.properties
        if (icProps != null && icProps.namespace != null) {
          namespace = icProps.namespace;
          jobName = icProps.job_name;

          if (icProps.pod_names != null) {
            podNames = icProps.pod_names;
          }
        }
      }
    }

    return {
      rancherURL: rancherURL,
      clusterName: clusterName,
      namespace: namespace,
      jobName: jobName,
      podNames: podNames
    };
  }

  render() {
    let rancherTableRows = []

    if (this.state.rancherURL != null && this.state.clusterName != null) {
      let baseURL = "https://" + this.state.rancherURL + "/dashboard/c/" + this.state.clusterName + "/explorer";

      if (this.state.namespace != null) {
        if (this.state.jobName != null) {
          let url = baseURL + "/batch.job/" + this.state.namespace + "/" + this.state.jobName;

          rancherTableRows.push(<tr>
            <td>Job</td>
            <td>{this.state.namespace}</td>
            <td><a href={url}>{this.state.jobNname}</a></td>
          </tr>)
        }

        for (const podName of this.state.podNames) {
          let url = baseURL + "/pod/" + this.state.namespace + "/" + podName;

          rancherTableRows.push(<tr>
            <td>Pod</td>
            <td>{this.state.namespace}</td>
            <td><a href={url}>{podName}</a></td>
          </tr>)
        }
      }
    }

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
            <h4>Resources</h4>
            <Table striped size="sm">
              <thead>
                <tr>
                  <th>Kind</th>
                  <th>Namespace</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {rancherTableRows}
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
