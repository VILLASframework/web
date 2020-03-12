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
import {Button, FormGroup, FormLabel, FormText} from 'react-bootstrap';

import Table from '../common/table';
import TableColumn from '../common/table-column';
import Dialog from "../common/dialogs/dialog";

import SignalStore from "./signal-store"
import Icon from "../common/icon";

class EditSignalMapping extends React.Component {
  valid = false;

  static getStores() {
    return [ SignalStore];
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
        dir,
        signals: [],
      };
  }

  static getDerivedStateFromProps(props, state){

    // filter all signals by configID and direction
    let signals = props.signals.filter((sig) => {
      return (sig.configID === props.configID) && (sig.direction === state.dir);
    });

    return {
      signals: signals
    };
  }


  onClose(canceled) {
      if (canceled === false) {
        if (this.valid) {
          let data = this.state.signals;

          //forward modified signals back to callback function
          this.props.onCloseEdit(data, this.state.dir)
        }
      } else {
        this.props.onCloseEdit(null, this.state.dir);
      }
    }

  onDelete(e){
    console.log("On signal delete");
  }


  handleMappingChange = (event, row, column) => {
      const signals = this.state.signals;

      if (column === 1) { // Name change
          if (event.target.value !== '') {
            signals[row].name = event.target.value;
            this.setState({signals: signals});
            this.valid = true;
          }
      } else if (column === 2) { // unit change
          if (event.target.value !== '') {
            signals[row].unit = event.target.value;
            this.setState({signals: signals});
            this.valid = true;
          }
      } else if (column === 0) { //index change

            signals[row].index = parseInt(event.target.value, 10);
            this.setState({signals: signals});
            this.valid = true;
      }
  };

  handleDelete = (index) => {

    let data = this.state.signals[index]
    this.props.onDelete(data);

  };

  handleAdd = () => {
    console.log("add signal");

    let newSignal = {
      configID: this.props.configID,
      direction: this.state.dir,
      name: "PlaceholderName",
      unit: "PlaceholderUnit",
      index: 999
    };

    this.props.onAdd(newSignal)

  };

  resetState() {
      this.valid=false;

      let signals = this.props.signals.filter((sig) => {
        return (sig.configID === this.props.configID) && (sig.direction === this.state.dir);
      });

      this.setState({signals: signals})
  }

  render() {

      const buttonStyle = {
        marginLeft: '10px'
      };

      return(

        <Dialog show={this.props.show} title="Edit Signal Mapping" buttonTitle="Save Edits" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>

          <FormGroup>
              <FormLabel>{this.props.direction} Mapping</FormLabel>
              <FormText>Click <i>Index</i>, <i>Name</i> or <i>Unit</i> cell to edit</FormText>
              <Table data={this.state.signals}>
                  <TableColumn title='Index' dataKey='index' inlineEditable onInlineChange={(e, row, column) => this.handleMappingChange(e, row, column)} />
                  <TableColumn title='Name' dataKey='name' inlineEditable onInlineChange={(e, row, column) => this.handleMappingChange(e, row, column)} />
                  <TableColumn title='Unit' dataKey='unit' inlineEditable onInlineChange={(e, row, column) => this.handleMappingChange(e, row, column)} />
                  <TableColumn title='Remove' deleteButton onDelete={(index) => this.handleDelete(index)} />
              </Table>

              <div style={{ float: 'right' }}>
                <Button onClick={() => this.handleAdd()} style={buttonStyle}><Icon icon="plus" /> Signal</Button>
              </div>
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
            configID: PropTypes.number.isRequired,
            index: PropTypes.number.isRequired

        })
    ),
    onChange: PropTypes.func
};

export default EditSignalMapping;
