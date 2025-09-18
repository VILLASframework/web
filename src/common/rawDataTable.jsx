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
