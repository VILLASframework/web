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
 import { Badge } from 'react-bootstrap';
 import { stateLabelStyle } from "../../ic/ics";


 class WidgetICstatus extends React.Component {
 
  shouldComponentUpdate(nextProps) {
    if (this.props.ics.length !== nextProps.ics.length) {
      return true
    } else {
      for (var i = 0; i < nextProps.length; i++) {
        if (nextProps.ics[i].state !== this.props.ics[i].state){
          return true
        }
      }
    }
    return false
  }

  render() {
    let badges = []
    if (this.props.ics) {
      this.props.ics.forEach(ic =>{
        let badgeStyle = stateLabelStyle(ic.state, ic)
        badges.push(<Badge 
          key={ic.id} 
          bg={badgeStyle[0]}
          className={badgeStyle[1]}>
          {ic.name + ": " + ic.state}</Badge>)
      })
    }

    return (<div>{badges}</div>);
  }
}

export default WidgetICstatus;
