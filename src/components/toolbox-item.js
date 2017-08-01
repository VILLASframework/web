/**
 * File: toolbox-item.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
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
import { DragSource } from 'react-dnd';
import classNames from 'classnames';

const toolboxItemSource = {
  beginDrag(props) {
    return {
      name: props.name
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class ToolboxItem extends React.Component {
  static defaultProps = {
    disabled: false
  };

  render() {
    var itemClass = classNames({
      'toolbox-item': true,
      'toolbox-item-dragging': this.props.isDragging,
      'toolbox-item-disabled': this.props.disabled
    });
    var dropEffect = 'copy';

    if (this.props.disabled === false) {
      return this.props.connectDragSource(
        <span className={itemClass}>
          {this.props.name}
        </span>
      , {dropEffect});
    } else {
      return (
        <span className={itemClass}>
          {this.props.name}
        </span>
      );
    }
  }
}

export default DragSource('widget', toolboxItemSource, collect)(ToolboxItem);
