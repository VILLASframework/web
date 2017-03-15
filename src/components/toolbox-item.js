/**
 * File: toolbox-item.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component, PropTypes } from 'react';
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

class ToolboxItem extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  };

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
