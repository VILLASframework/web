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
import {FormGroup, FormControl, FormLabel, Col} from 'react-bootstrap';
import Table from "../common/table";

import Dialog from '../common/dialogs/dialog';
import ParametersEditor from '../common/parameters-editor';

class EditResultDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      configSnapshots: '',
      description: '',
      resultFileIDs: [],
      id:0,
    };
  }

  onClose = canceled => {
    if (canceled) {
      if (this.props.onClose != null) {
        this.props.onClose();
      }
      return;
    }

    if (this.valid && this.props.onClose != null) {
      this.props.onClose(this.state);
    }
  };

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  resetState = () => {
    this.setState({
      configSnapshots: this.props.configSnapshots,
      description: this.props.description,
      resultFileIDs: this.props.resultFileIDs,
      id: this.props.id,
    });
  };

  handleStartParametersChange = startParameters => {
    this.setState({ startParameters });
  };

  // TODO: file reading necessary? or can it just be saved?
  loadFile = event => {
    // get file
    const file = event.target.files[0];
  
    // create file reader
    let reader = new FileReader();
    let self = this;

    reader.onload = event => {
      const config = JSON.parse(event.target.result);

      self.imported = true;
      self.valid = true;
      this.setState({filename: config.name, file: config });
    };

    reader.readAsBinaryString(file);
  }

  render() {
    return <Dialog show={this.props.show} title={'Edit Result No. '+this.state.id} buttonTitle='Save' onClose={this.onClose} onReset={this.resetState} valid={true}>
      <form>
        <FormGroup as={Col} controlId='description'>
          <FormLabel column={false}>Description</FormLabel>
          <FormControl type='text' placeholder='Enter description' value={this.state.description} onChange={this.handleChange} />
          <FormControl.Feedback />
        </FormGroup>

        

        <FormGroup controlId='resultfile'>
            <FormLabel>Add Result File</FormLabel>
            <FormControl type='file' onChange={this.loadFile} />
        </FormGroup>
      
      </form>
    </Dialog>;
  }
}

export default EditResultDialog;

/*
<Table data={this.props.files}>
            <TableColumn title='Name' dataKey='name'/>
            <TableColumn title='Size (bytes)' dataKey='size'/>
            <TableColumn title='Type' dataKey='type'/>
            <TableColumn
              title=''
              deleteButton
              onDelete={(index) => this.deleteFile(index)}
            />
          </Table>

          '*/
