/**
 *
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
import PropTypes from 'prop-types';
import { FormGroup, FormLabel, FormText } from 'react-bootstrap';

import Table from '../common/table';
import TableColumn from '../common/table-column';
import Dialog from "../common/dialogs/dialog";

import SignalStore from "./signal-store"
import LoginStore from "../user/login-store";

class EditSignalMapping extends React.Component {

  static getStores() {
    return [ SignalStore, LoginStore];
  }

  constructor(props) {
      super(props);

      let dir = "";
      if ( this.props.direction === "Output"){
        dir = "out";
      } else if ( this.props.direction === "Input" ){
        dir = "in";
      }

      this.state = {
        sessionToken: LoginStore.getState().token,
        dir
      };
  }

  componentDidMount(): void {

  }

  onClose(canceled) {
      if (canceled === false) {
        if (this.valid) {
          // TODO
          let data = null;

          //forward modified simulation model to callback function
          this.props.onClose(data)
        }
      } else {
        this.props.onClose();
      }
    }


  handleMappingChange = (event, row, column) => {
      const signals = this.state.signals;

      //const length = this.state.length;

      if (column === 1) { // Name change
          signals[row].name = event.target.value;
      } else if (column === 2) { // unit change
          signals[row].unit = event.target.value;
      } else if (column === 0) { //index change
          signals[row].index = event.target.value;
      }

      //this.setState({ length, signals });
      //TODO dispatch changes by calling API

      /*if (this.props.onChange != null) {
          this.props.onChange(this.state.length, signals);
      }
      */
  }

  resetState() {
    //this.setState({});
  }

  render() {

      // filter all signals by Simulation Model ID and direction
      let signals = this.props.signals.filter((sig) => {
        return (sig.simulationModelID === this.props.simulationModelID) && (sig.direction === this.state.dir);
      });

      return(

        <Dialog show={this.props.show} title="Edit Signal Mapping" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>

          {/*
            <FormGroup validated={this.validateLength()}>
              <FormLabel>{this.props.name} Length</FormLabel>
              <FormControl name='length' type='number' placeholder='Enter length' defaultValue={this.state.length}
                           min='1' onBlur={this.handleLengthChange}/>
              <FormControl.Feedback/>
            </FormGroup>
          */}

          <FormGroup>
              <FormLabel>{this.props.direction} Mapping</FormLabel>
              <FormText>Click <i>name</i> or <i>type</i> cell to edit</FormText>
              <Table data={signals}>
                  <TableColumn title='Index' dataKey='index' inlineEditable onInlineChange={this.handleMappingChange()} />
                  <TableColumn title='Name' dataKey='name' inlineEditable onInlineChange={this.handleMappingChange} />
                  <TableColumn title='Unit' dataKey='unit' inlineEditable onInlineChange={this.handleMappingChange} />
              </Table>
          </FormGroup>
        </Dialog>
  );
  }
}

EditSignalMapping.propTypes = {
    name: PropTypes.string,
    length: PropTypes.number,
    signals: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            unit: PropTypes.string.isRequired,
            direction: PropTypes.string.isRequired,
            simulationModelID: PropTypes.number.isRequired,
            index: PropTypes.number.isRequired

        })
    ),
    onChange: PropTypes.func
};

export default EditSignalMapping;
