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
import AppDispatcher from '../../common/app-dispatcher';


class WidgetICstatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: localStorage.getItem("token")
    };
  }

  componentDidMount() {
    // Start timer for periodic refresh
    this.timer = window.setInterval(() => this.refresh(), 5000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  refresh() {
    if (this.props.ics) {
      this.props.ics.forEach(ic => {
        let icID = parseInt(ic.id, 10);
        AppDispatcher.dispatch({
          type: 'ics/start-load',
          data: icID,
          token: this.state.sessionToken,
        });
      })
    }
  }

  render() {
    let badges = []
    let checkedICs = []
    if (this.props.widget) {
      checkedICs = this.props.widget.customProperties.checkedIDs
    }
    if (this.props.ics && checkedICs) {
      this.props.ics.forEach(ic => {
        if (!checkedICs.includes(ic.id)) {
          return
        }
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
