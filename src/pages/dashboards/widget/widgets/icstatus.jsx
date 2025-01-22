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
import { stateLabelStyle } from "../../../infrastructure/styles";
import { loadICbyId } from "../../../../store/icSlice";
import { sessionToken } from "../../../../localStorage";
import { useDispatch } from "react-redux";
import { useLazyGetICbyIdQuery } from "../../../../store/apiSlice";

let timer = null;
const WidgetICstatus = (props) => {
  const dispatch = useDispatch();
  const [ics, setIcs] = useState(props.ics);
  const [triggerGetICbyId] = useLazyGetICbyIdQuery();
  const refresh = async () => {
    if (props.ics) {
      try {
        const requests = props.ics.map((ic) =>
          triggerGetICbyId({ id: ic.id, token: sessionToken }).unwrap()
        );

        const results = await Promise.all(requests);
        setIcs(results);
      } catch (error) {
        console.error("Error loading ICs:", error);
      }
    }
  };
  useEffect(() => {
    window.clearInterval(timer);
    timer = window.setInterval(refresh, 3000);
    // Function to refresh data
    refresh();
    // Cleanup function equivalent to componentWillUnmount
    return () => {
      window.clearInterval(timer);
    };
  }, [props.ics]);

  let badges = [];
  let checkedICs = props.widget ? props.widget.customProperties.checkedIDs : [];

  if (props.ics && checkedICs) {
    badges = ics
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
