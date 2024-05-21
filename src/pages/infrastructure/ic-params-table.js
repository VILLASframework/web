import { Table, } from 'react-bootstrap';
import moment from 'moment';
import { isJSON } from '../../utils/isJson';
import ReactJson from 'react-json-view';

const ICParamsTable = (props) => {
    const ic = props.ic;

    return(
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
            <td>{ic.state}</td>
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
              {isJSON(ic.startparameterschema) ?
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

export default ICParamsTable;