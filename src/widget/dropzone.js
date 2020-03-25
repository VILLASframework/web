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
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';

const dropzoneTarget = {
  drop(props, monitor, component) {
    // get drop position
    var position = monitor.getSourceClientOffset();
    var dropzoneRect = component.wrapper.getBoundingClientRect();
    position.x -= dropzoneRect.left;
    position.y -= dropzoneRect.top;

    // Z-Index is one more the top most children
    let foundZ = props.children.reduce( (maxZ, currentChildren) => {
      if (currentChildren.props != null) {
        // Is there a simpler way? Is not easy to expose a getter in a Container.create(Component)
        let widget = currentChildren.props.data;
        if (widget && widget.z) {
          if (widget.z > maxZ) {
            return widget.z;
          }
        }
      }

      return maxZ;
    }, 0);
    position.z = foundZ >= 100? foundZ : ++foundZ;

    props.onDrop(monitor.getItem(), position);
  }
};

function collect(connect, monitor) {

  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class Dropzone extends React.Component {
  render() {

    var toolboxClass = classNames({
      'box-content': true,
      'toolbox-dropzone': true,
      'toolbox-dropzone-active': this.props.isOver && this.props.canDrop && this.props.editing,
      'toolbox-dropzone-editing': this.props.editing
    });

    return this.props.connectDropTarget(
      <div className={toolboxClass} style={{ height: this.props.height}} ref={wrapper => this.wrapper = wrapper}>
        {this.props.children}
      </div>
    );
  }
}

export default DropTarget('widget', dropzoneTarget, collect)(Dropzone);
