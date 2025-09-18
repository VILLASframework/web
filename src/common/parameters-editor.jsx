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

import React from "react";
import { JsonEditor } from "json-edit-react";

class ParametersEditor extends React.Component {
  handleJsonUpdate = ({ newData }) => {
    if (this.props.disabled) return;

    this.props.onChange(JSON.parse(JSON.stringify(newData)));
  };

  render() {
    const containerStyle = {
      minHeight: "100px",

      paddingTop: "5px",
      paddingBottom: "5px",
      paddingLeft: "8px",

      border: "1px solid lightgray",
    };

    return (
      <div style={containerStyle}>
        <JsonEditor
          data={this.props.content}
          rootName={false}
          showDataTypes={false}
          showObjectSize={false}
          enableClipboard={false}
          onUpdate={this.handleJsonUpdate}
        />
      </div>
    );
  }
}

export default ParametersEditor;
