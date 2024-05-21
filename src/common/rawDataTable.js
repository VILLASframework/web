import { isJSON } from "../utils/isJson";
import ReactJson from "react-json-view";

const RawDataTable = (props) => {
    if(props.rawData !== null && isJSON(props.rawData)){
      return (
        <ReactJson
          src={props.rawData}
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

export default RawDataTable;