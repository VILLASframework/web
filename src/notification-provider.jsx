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

import NotificationSystem from "@ybochatay/react-notification-system";
import { createContext, useCallback, useContext, useMemo, useRef } from "react";

//context for refering to the provider
const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const ref = useRef(null);

  //wrapping the api functions in useCallback and useMemo to avoid re-renders
  const notifyInfo = useCallback((message) => {
    ref.current?.addNotification({ level: "info", message });
  }, []);

  const notifyError = useCallback((message) => {
    ref.current?.addNotification({ level: "error", message });
  }, []);

  const notifyWarning = useCallback((message) => {
    ref.current?.addNotification({ level: "warning", message });
  }, []);

  const notifySuccess = useCallback((message) => {
    ref.current?.addNotification({ level: "success", message });
  }, []);

  const api = useMemo(
    () => ({
      notifyInfo,
      notifyError,
      notifyWarning,
      notifySuccess,
    }),
    [notifyInfo, notifyError, notifyWarning, notifySuccess]
  );

  return (
    <NotificationContext.Provider value={api}>
      <NotificationSystem ref={ref} newOnTop />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
