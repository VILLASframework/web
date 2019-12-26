/**
 * File: widget-container.js
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

class WidgetContainer extends React.Component {
  render() {
    const containerStyle = {
      width: Number(this.props.widget.width),
      height: Number(this.props.widget.height),
      left: Number(this.props.widget.x),
      top: Number(this.props.widget.y),
      zindex: Number(this.props.widget.z),
      position: 'absolute'
    };

    return <div className='widget' style={containerStyle}>
      {this.props.children}
    </div>;
  }
}

WidgetContainer.propTypes = {
  widget: PropTypes.object.isRequired,
  children: PropTypes.node, //TODO is .node correct here? Was .children before leading to compile error
};

export default WidgetContainer
