import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { sessionToken } from '../localStorage';

export const apiSlice = createApi({
  reducerPath: 'scenarios',
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
    getScenarios: builder.query({
      query: () => 'scenarios',
    }),
    getScenarioById: builder.query({
      query: (id) => `scenarios/${id}`,
    }),
    addScenario: builder.mutation({
      query: (scenario) => ({
        url: 'scenarios',
        method: 'POST',
        body: scenario,
      }),
    }),
    deleteScenario: builder.mutation({
      query: (id) => ({
        url: `scenarios/${id}`,
        method: 'DELETE',
      }),
    }),
    updateScenario: builder.mutation({
      query: ({ id, ...updatedScenario }) => ({
        url: `scenarios/${id}`,
        method: 'PUT',
        body: updatedScenario,
      }),
    }),
    getConfigs: builder.query({
      query: (scenarioID) => `configs?scenarioID=${scenarioID}`,
    }),
    getUsersOfScenario: builder.query({
      query: (scenarioID) => `scenarios/${scenarioID}/users/`,
    }),
    getDashboards: builder.query({
      query: (scenarioID) => `dashboards?scenarioID=${scenarioID}`,
    }),
    getICS: builder.query({
      query: () => 'ic',
    }),
    addUserToScenario: builder.mutation({
      query: ({ scenarioID, username }) => {
        return ({
        url: `scenarios/${scenarioID}/user?username=${username}`,
        method: 'PUT',
      })},
    }),
    removeUserFromScenario: builder.mutation({
      query: ({ scenarioID, username }) => ({
        url: `scenarios/${scenarioID}/user/?username=${username}`,
        method: 'DELETE',
      }),
    }),
    addComponentConfig: builder.mutation({
      query: (config) => ({
        url: 'configs',
        method: 'POST',
        body: config,
      }),
    }),
    deleteComponentConfig: builder.mutation({
      query: (configID) => ({
        url: `configs/${configID}`,
        method: 'DELETE',
      }),
    }),
    addDashboard: builder.mutation({
      query: (dashboard) => ({
        url: 'dashboards',
        method: 'POST',
        body: dashboard,
      }),
    }),
    deleteDashboard: builder.mutation({
      query: (dashboardID) => ({
        url: `dashboards/${dashboardID}`,
        method: 'DELETE',
      }),
    }),
    updateDashboard: builder.mutation({
      query: ({ dashboardID, dashboard }) => ({
        url: `dashboards/${dashboardID}`,
        method: 'PUT',
        body: {dashboard},
      }),
    }),
    getSignals: builder.query({
      query: ({ direction, configID }) => ({
        url: 'signals',
        params: { direction, configID },
      }),
    }),
    addSignal: builder.mutation({
      query: (signal) => ({
        url: 'signals',
        method: 'POST',
        body: { signal },
      }),
    }),
    deleteSignal: builder.mutation({
      query: (signalID) => ({
        url: `signals/${signalID}`,
        method: 'DELETE',
      }),
    }),
    //users
    getUsers: builder.query({
      query: () => 'users',
    }),
    getUserById: builder.query({
      query: (id) => `users/${id}`,
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: 'users',
        method: 'POST',
        body: user,
      }),
    }),
    updateUser: builder.mutation({
      query: (user) => {
        return {
        url: `users/${user.id}`,
        method: 'PUT',
        body: {user: user},
      }},
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
    }),
    //results
    getResults: builder.query({
      query: (scenarioID) => ({
        url: 'results',
        params: { scenarioID },
      }),
    }),
    addResult: builder.mutation({
      query: (result) => ({
        url: 'results',
        method: 'POST',
        body: result,
      }),
    }),
    deleteResult: builder.mutation({
      query: (resultID) => ({
        url: `results/${resultID}`,
        method: 'DELETE',
      }),
    }),
    //files
    getFiles: builder.query({
      query: (scenarioID) => ({
        url: 'files',
        params: { scenarioID },
      }),
    }),
    addFile: builder.mutation({
      query: ({ scenarioID, file }) => {
        const formData = new FormData();
        formData.append('inputFile', file);
        return {
          url: `files?scenarioID=${scenarioID}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    downloadFile: builder.query({
      query: (fileID) => ({
        url: `files/${fileID}`,
        responseHandler: 'blob',
        responseType: 'blob',
      }),
    }),
    updateFile: builder.mutation({
      query: ({ fileID, file }) => {
        const formData = new FormData();
        formData.append('inputFile', file);
        return {
          url: `files/${fileID}`,
          method: 'PUT',
          body: formData,
        };
      },
    }),
    deleteFile: builder.mutation({
      query: (fileID) => ({
        url: `files/${fileID}`,
        method: 'DELETE',
      }),
    }),
    sendAction: builder.mutation({
      query: (params) => ({
        url: `/ic/${params.icid}/action`,
        method: 'POST',
        body: [params],
      }),
    }),
    
    getDashboard: builder.query({
      query: (dashboardID) => `/dashboards/${dashboardID}`,
    }),

    getWidgets: builder.query({
      query: (dashboardID) => ({
        url: 'widgets',
        params: { dashboardID },
      }),
    }),
    addWidget: builder.mutation({
      query: (widget) => ({
        url: 'widgets',
        method: 'POST',
        body: { widget },
      }),
    }),
    getWidget: builder.query({
      query: (widgetID) => `/widgets/${widgetID}`,
    }),
    updateWidget: builder.mutation({
      query: ({ widgetID, updatedWidget }) => ({
        url: `/widgets/${widgetID}`,
        method: 'PUT',
        body: updatedWidget,
      }),
    }),
    deleteWidget: builder.mutation({
      query: (widgetID) => ({
        url: `/widgets/${widgetID}`,
        method: 'DELETE',
      }),
    }),

    getConfig: builder.query({
      query: () => '/config',
    })
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
} = apiSlice;
