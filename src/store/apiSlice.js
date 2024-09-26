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

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { sessionToken } from '../localStorage';
import { widgetEndpoints } from './endpoints/widget-endpoints';
import { scenarioEndpoints } from './endpoints/scenario-endpoints';
import { dashboardEndpoints } from './endpoints/dashboard-endpoints';
import { icEndpoints } from './endpoints/ic-endpoints';
import { configEndpoints } from './endpoints/config-endpoints';
import { userEndpoints } from './endpoints/user-endpoints';
import { fileEndpoints } from './endpoints/file-endpoints';
import { signalEndpoints } from './endpoints/signal-endpoints';
import { resultEndpoints } from './endpoints/result-endpoints';
import { authEndpoints } from './endpoints/auth-endpoints';
import { websocketEndpoints } from './endpoints/websocket-endpoints';
import { usergroupEndpoints } from './endpoints/usergroup-endpoints';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v2',
    prepareHeaders: (headers) => {
      const token = sessionToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    ...widgetEndpoints(builder),
    ...icEndpoints(builder),
    ...fileEndpoints(builder),
    ...configEndpoints(builder),
    ...scenarioEndpoints(builder),
    ...dashboardEndpoints(builder),
    ...userEndpoints(builder),
    ...resultEndpoints(builder),
    ...signalEndpoints(builder),
    ...authEndpoints(builder),
    ...websocketEndpoints(builder),
    ...usergroupEndpoints(builder),
  }),
});

export const { 
  useGetScenariosQuery, 
  useGetScenarioByIdQuery, 
  useGetConfigsQuery, 
  useLazyGetConfigsQuery,
  useGetDashboardsQuery, 
  useGetICSQuery,
  useAddScenarioMutation,   
  useDeleteScenarioMutation,
  useUpdateScenarioMutation,
  useGetUsersOfScenarioQuery,
  useAddUserToScenarioMutation,
  useRemoveUserFromScenarioMutation,
  useAddComponentConfigMutation,
  useDeleteComponentConfigMutation,
  useAddDashboardMutation,
  useDeleteDashboardMutation,
  useLazyGetSignalsQuery,
  useGetSignalsQuery,
  useAddSignalMutation,
  useDeleteSignalMutation,
  useGetResultsQuery,
  useAddResultMutation,
  useDeleteResultMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetFilesQuery,
  useAddFileMutation,
  useLazyDownloadFileQuery,
  useUpdateFileMutation,
  useDeleteFileMutation,
  useGetDashboardQuery,
  useUpdateDashboardMutation,
  useSendActionMutation,
  useAddWidgetMutation,
  useLazyGetWidgetsQuery,
  useUpdateWidgetMutation,
  useDeleteWidgetMutation,
  useGetConfigQuery,
  useAuthenticateUserMutation,
  useLazyGetFilesQuery,
  useUpdateSignalMutation,
  useGetIcDataQuery,
  useLazyDownloadImageQuery,
  useUpdateComponentConfigMutation,
  useGetUsergroupsQuery,
  useAddUsergroupMutation,
  useDeleteUsergroupMutation,
  useGetUsergroupByIdQuery,
  useGetUsersByUsergroupIdQuery,
  useAddUserToUsergroupMutation,
  useDeleteUserFromUsergroupMutation,
  useUpdateUsergroupMutation
} = apiSlice;
