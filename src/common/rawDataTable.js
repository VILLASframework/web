import { isJSON } from "../utils/isJson";
import { JsonEditor } from "json-edit-react";

const RawDataTable = (props) => {
  if (props.rawData !== null && isJSON(props.rawData)) {
    return (
      <JsonEditor
        data={props.rawData}
        rootName={false}
        showDataTypes={false}
        showObjectSize={false}
        enableClipboard={false}
        collapsed={1}
        editable={true}
        viewOnly
      />
    );
  } else {
    return <div>No valid JSON raw data available.</div>;
  }
};

export default RawDataTable;
