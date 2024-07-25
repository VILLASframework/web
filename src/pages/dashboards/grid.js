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

class Grid extends React.Component {
  render() {
    if (this.props.disabled) return false;

    return (
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width={this.props.size} height={this.props.size} patternUnits="userSpaceOnUse">
            <path d={"M " + this.props.size + " 0 L 0 0 0 " + this.props.size} fill="none" stroke="gray" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    );
  }
}

export default Grid;
