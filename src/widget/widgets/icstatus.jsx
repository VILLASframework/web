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

import React, { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import { stateLabelStyle } from "../../ic/ics";
import AppDispatcher from "../../common/app-dispatcher";

const WidgetICstatus = (props) => {
  const [sessionToken, setSessionToken] = useState(
    localStorage.getItem("token")
  );

  useEffect(() => {
    // Function to refresh data
    const refresh = () => {
      if (props.ics) {
        props.ics.forEach((ic) => {
          let icID = parseInt(ic.id, 10);
          AppDispatcher.dispatch({
            type: "ics/start-load",
            data: icID,
            token: sessionToken,
          });
        });
      }
    };

    // Start timer for periodic refresh
    const timer = window.setInterval(() => refresh(), 3000);

    // Cleanup function equivalent to componentWillUnmount
    return () => {
      window.clearInterval(timer);
    };
  }, [props.ics, sessionToken]);

  let badges = [];
  let checkedICs = props.widget ? props.widget.customProperties.checkedIDs : [];

  if (props.ics && checkedICs) {
    badges = props.ics
      .filter((ic) => checkedICs.includes(ic.id))
      .map((ic) => {
        let badgeStyle = stateLabelStyle(ic.state, ic);
        return (
          <Badge key={ic.id} bg={badgeStyle[0]} className={badgeStyle[1]}>
            {ic.name + ": " + ic.state}
          </Badge>
        );
      });
  }

  return <div>{badges}</div>;
};

export default WidgetICstatus;
