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

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetDashboardQuery,
  useGetICSQuery,
  useLazyGetWidgetsQuery,
  useLazyGetConfigsQuery,
  useLazyGetFilesQuery,
  useLazyGetSignalsQuery,
  useGetWidgetsQuery,
} from "../../store/apiSlice";
import { useState } from "react";
import DashboardLayout from "./dashboard-layout";
import ErrorBoundary from "./dashboard-error-boundry";

const Dashboard = ({}) => {
  const params = useParams();
  const { data: { ics } = [] } = useGetICSQuery();
  const {
    data: { dashboard } = {},
    isFetching: isFetchingDashboard,
    refetch: refetchDashboard,
  } = useGetDashboardQuery(params.dashboard);
  const [triggerGetConfigs] = useLazyGetConfigsQuery();
  const [triggerGetFiles] = useLazyGetFilesQuery();
  const [triggerGetSignals] = useLazyGetSignalsQuery();

  const [editing, setEditing] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!isFetchingDashboard) {
      setGridParameters({ height: dashboard.height, grid: dashboard.grid });
      fetchWidgetData(dashboard.scenarioID);
    }
  }, [isFetchingDashboard]);

  const fetchWidgetData = async (scenarioID) => {
    try {
      const configsRes = await triggerGetConfigs(scenarioID).unwrap();
      if (configsRes.configs) {
        setConfigs(configsRes.configs);
        //load signals if there are any configs

        if (configsRes.configs.length > 0) {
          for (const config of configsRes.configs) {
            const signalsInRes = await triggerGetSignals({
              configID: config.id,
              direction: "in",
            }).unwrap();
            const signalsOutRes = await triggerGetSignals({
              configID: config.id,
              direction: "out",
            }).unwrap();
            setSignals((prevState) => [
              ...signalsInRes.signals,
              ...signalsOutRes.signals,
              ...prevState,
            ]);
          }
        }
      }
    } catch (err) {
      console.log("error fetching data", err);
    }
  };

  return (
    <ErrorBoundary>
      <DashboardLayout />
    </ErrorBoundary>
  );
};

export default Dashboard;
