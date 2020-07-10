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
import { DragSource } from 'react-dnd';
import classNames from 'classnames';
import Icon from '../common/icon';

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
        <div className={itemClass}>
          <span className="btn btn-outline-info " style={{marginTop: '5px'}}>
            {this.props.icon && <Icon style={{marginRight: '5px'}} icon={this.props.icon} /> }
            {this.props.name}
          </span>
        </div>
      , {dropEffect});
    }
    else {
      return (
        <div className={itemClass}>
          <span className="btn btn-info" style={{marginTop: '5px'}}>
            {this.props.icon && <Icon style={{marginRight: '5px'}} icon={this.props.icon} /> }
            {this.props.name}
          </span>
        </div>
      );
    }
  }
}

export default DragSource('widget', toolboxItemSource, collect)(ToolboxItem);
