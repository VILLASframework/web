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
import {FormGroup, FormControl, FormLabel} from 'react-bootstrap';

class EditFileWidgetControl extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      files: [],
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      files: props.files.filter(file => file.type.includes(props.type))
    };
  }

  handleFileChange(e){
    this.props.handleChange({ target: { id: this.props.controlId, value: e.target.value } });
  }

  render() {

    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if(parts.length === 1){
      isCustomProperty = false;
    }

    let fileOptions = [];
    if (this.state.files.length > 0){
      fileOptions.push(
        <option key = {0} default>Select file</option>
        )
      fileOptions.push(this.state.files.map((file, index) => (
        <option key={index+1} value={file.id}>{file.name}</option>
      )))
    } else {
      fileOptions = <option style={{ display: 'none' }}>No files found</option>
    }

    return <div>
      <FormGroup controlId="file">
        <FormLabel>File</FormLabel>
        <FormControl
          as="select"
          value={isCustomProperty ? this.props.widget[parts[0]][parts[1]] : this.props.widget[this.props.controlId]}
          onChange={(e) => this.handleFileChange(e)}>{fileOptions} </FormControl>
      </FormGroup>
    </div>;
  }
}

export default EditFileWidgetControl;
