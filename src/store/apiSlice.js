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
  useGetIcDataQuery
} = apiSlice;
