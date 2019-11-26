/**
 * File: widget-area.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 31.05.2018
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

import Dropzone from './dropzone';
import Grid from './grid';

import WidgetFactory from '../widget/widget-factory';

class WidgetArea extends React.Component {
  snapToGrid(value) {
    if (this.props.grid === 1) {
      return value;
    }

    return Math.round(value / this.props.grid) * this.props.grid;
  }

  handleDrop = (item, position) => {
    position.x = this.snapToGrid(position.x);
    position.y = this.snapToGrid(position.y);

    const widget = WidgetFactory.createWidgetOfType(item.name, position, this.props.defaultSimulationModel);

    if (this.props.onWidgetAdded != null) {
      this.props.onWidgetAdded(widget);
    }
  }

  render() {
    const maxHeight = Object.values(this.props.widgets).reduce((currentHeight, widget) => {
      const absolutHeight = widget.y + widget.height;

      return absolutHeight > currentHeight ? absolutHeight : currentHeight;
    }, 0);

    return <Dropzone height={maxHeight + 80} onDrop={this.handleDrop} editing={this.props.editing}>
      {this.props.children}

      <Grid size={this.props.grid} disabled={this.props.grid === 1 || this.props.editing !== true} />
    </Dropzone>;
  }
}

WidgetArea.propTypes = {
  children: PropTypes.node, //TODO is .node correct here? Was .children before leading to compile error
  editing: PropTypes.bool,
  grid: PropTypes.number,
  defaultSimulationModel: PropTypes.string,
  widgets: PropTypes.array,
  onWidgetAdded: PropTypes.func
};

WidgetArea.defaultProps = {
  widgets: {}
};

export default WidgetArea;
