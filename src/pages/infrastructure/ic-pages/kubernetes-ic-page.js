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

import { Col, Row, Table} from "react-bootstrap";
import IconButton from "../../../common/buttons/icon-button";
import RawDataTable from "../../../common/rawDataTable";
import { useDispatch, useSelector } from "react-redux";
import { loadICbyId } from "../../../store/icSlice";
import { useGetICSQuery } from "../../../store/apiSlice";

import ICParamsTable from "../ic-params-table";

import { iconStyle, buttonStyle } from "../styles";

const KubernetesICPage = (props) => {

  const dispatch = useDispatch();


  const { user: currentUser, token: sessionToken } = useSelector((state) => state.auth);
  const ic = props.ic;

  const {data: icsRes, isLoading, refetch: refetchICs} = useGetICSQuery();
    const ics = icsRes ? icsRes.ics : [];
  const config = useSelector((state) => state.config.config);
  //const managedICs = ics.filter(managedIC => managedIC.category !== "manager" && managedIC.manager === ic.uuid);

  let namespace = null;
  let jobName = null;
  let podNames = [];
  let clusterName = null;
  let rancherURL = null;

  let managerIC = ics.find(manager => manager.uuid === ic.manager);

  // Take k8s cluster details from managers status update
  if (managerIC != null) {
    let managerProps = managerIC.statusupdateraw.properties;

    if (managerProps != null) {
      rancherURL = managerProps.rancher_url;
      clusterName = managerProps.cluster_name;
    }
  }

  // Fallback to backend config
  if (config != null && config.kubernetes != null) {
    let k8s = config.kubernetes;
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
    if (ic.statusupdateraw != null) {
      let icProps = ic.statusupdateraw.properties
      if (icProps != null && icProps.namespace != null) {
        namespace = icProps.namespace;
        jobName = icProps.job_name;

        if (icProps.pod_names != null) {
          podNames = icProps.pod_names;
        }
      }
    }
  }

  let rancherTableRows = []

  if (rancherURL != null && clusterName != null) {
    let baseURL = rancherURL + "/dashboard/c/" + clusterName + "/explorer";

    if (namespace != null) {
      if (jobName != null) {
        let url = baseURL + "/batch.job/" + namespace + "/" + jobName;

        rancherTableRows.push(<tr>
          <td>Job</td>
          <td>{namespace}</td>
          <td><a href={url}>{jobName}</a></td>
        </tr>)
      }

      for (const podName of podNames) {
        let url = baseURL + "/pod/" + namespace + "/" + podName;

        rancherTableRows.push(<tr>
          <td>Pod</td>
          <td>{namespace}</td>
          <td><a href={url}>{podName}</a></td>
        </tr>)
      }
    }
  }

  const refresh = () => {
    dispatch(loadICbyId({token: sessionToken, id: ic.id}));
  }

  return (
    <div className='section'>
      <h1>{ic.name}
        <span className='icon-button'>

          <IconButton
            childKey={2}
            tooltip='Refresh'
            onClick={() => refresh()}
            icon='sync-alt'
            buttonStyle={buttonStyle}
            iconStyle={iconStyle}
          />
        </span>
      </h1>
      <div>
        <Row>
          <Col>
            <h4>Properties</h4>
            <ICParamsTable ic={ic}/>
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
            <RawDataTable rawData={ic.statusupdateraw}/>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default KubernetesICPage;
