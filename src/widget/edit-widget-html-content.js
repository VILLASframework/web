/**
 * File: edit-widget-html-content.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 03.09.2017
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
 **********************************************************************************/

import React from 'react';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';

class EditWidgetHTMLContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {}
    };
  }

  handleKeyIgnore(event){
  // This function prevents a keystroke from beeing handled by dialog.js
  event.stopPropagation();
  }

  componentWillReceiveProps(nextProps) {
    // Update state's widget with props
    this.setState({ widget: nextProps.widget });
  }

  render() {
    return <FormGroup controlId={this.props.controlId}>
      <FormLabel>HTML Content</FormLabel>
      <FormControl onKeyPress={this.handleKeyIgnore} componentClass="textarea" style={{ height: 200 }} placeholder={this.props.placeholder} value={this.state.widget[this.props.controlId] || ''} onChange={e => this.props.handleChange(e)} />
    </FormGroup>;
  }
}

export default EditWidgetHTMLContent;
