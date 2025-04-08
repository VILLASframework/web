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

import { useState, useEffect, useMemo } from "react";
import {
  useLazyGetFilesQuery,
  useLazyGetConfigsQuery,
  useLazyGetSignalsQuery,
  useGetICSQuery,
} from "../../../store/apiSlice";

// a custom hook designed to deliver data required for a dashboard and its widgets
export const useDashboardData = (scenarioID) => {
  const [files, setFiles] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [signals, setSignals] = useState([]);
  const [activeICS, setActiveICS] = useState([]);
  const { data: { ics } = { ics: [] } } = useGetICSQuery();

  const [triggerGetFiles] = useLazyGetFilesQuery();
  const [triggerGetConfigs] = useLazyGetConfigsQuery();
  const [triggerGetSignals] = useLazyGetSignalsQuery();

  const fetchDashboardData = async () => {
    if (!scenarioID) return;

    //in case of refetching
    setFiles([]);
    setConfigs([]);
    setSignals([]);

    try {
      // Fetch files
      const filesRes = await triggerGetFiles(scenarioID).unwrap();
      if (filesRes?.files) {
        setFiles(filesRes.files);
      }

      // Fetch configs and signals
      const configsRes = await triggerGetConfigs(scenarioID).unwrap();
      console.log("GOT CONFIGS", configsRes);
      if (configsRes?.configs) {
        setConfigs(configsRes.configs);

        for (const config of configsRes.configs) {
          const signalsInRes = await triggerGetSignals({
            configID: config.id,
            direction: "in",
          }).unwrap();
          const signalsOutRes = await triggerGetSignals({
            configID: config.id,
            direction: "out",
          }).unwrap();

          setSignals((prev) => [
            ...prev,
            ...signalsInRes.signals,
            ...signalsOutRes.signals,
          ]);
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    if (scenarioID) {
      fetchDashboardData();
    }
  }, [scenarioID]);

  // Derive active ICS based on the fetched configs
  useEffect(() => {
    let usedICS = [];
    for (const config of configs) {
      usedICS.push(config.icID);
    }
    setActiveICS(ics.filter((i) => usedICS.includes(i.id)));
  }, [configs]);

  return {
    files,
    configs,
    signals,
    activeICS,
    refetchDashboardData: fetchDashboardData,
  };
};
