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
import PropTypes from "prop-types";
import { JsonEditor } from "json-edit-react";

class ParametersEditor extends React.Component {
  handleJsonUpdate = ({ newData }) => {
    this.props.onChange(JSON.parse(JSON.stringify(newData)));
  };

  render() {
    const containerStyle = {
      width: "100%",
      minHeight: "100px",
      padding: "5px",
      border: "1px solid lightgray",
      display: "flex",
    };

    return (
      <div className="parameters-editor" style={containerStyle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <JsonEditor
            data={this.props.content}
            rootName={false}
            showDataTypes={false}
            showObjectSize={false}
            enableClipboard={false}
            onUpdate={this.handleJsonUpdate}
            minWidth={0}
            maxWidth="100%"
            theme={{ styles: { container: { width: "100%" } } }}
          />
        </div>
      </div>
    );
  }
}

ParametersEditor.propTypes = {
  content: PropTypes.object,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

ParametersEditor.defaultProps = {
  content: {},
  disabled: false,
};

export default ParametersEditor;
