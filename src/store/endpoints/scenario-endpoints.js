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

export const scenarioEndpoints = (builder) => ({
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
    getUsersOfScenario: builder.query({
      query: (scenarioID) => `scenarios/${scenarioID}/users/`,
    }),
    addUserToScenario: builder.mutation({
      query: ({ scenarioID, username }) => ({
        url: `scenarios/${scenarioID}/user?username=${username}`,
        method: 'PUT',
      }),
    }),
    removeUserFromScenario: builder.mutation({
      query: ({ scenarioID, username }) => ({
        url: `scenarios/${scenarioID}/user/?username=${username}`,
        method: 'DELETE',
      }),
    }),
});
