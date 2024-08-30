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

export const configEndpoints = (builder) => ({
    getConfigs: builder.query({
      query: (scenarioID) => `configs?scenarioID=${scenarioID}`,
    }),
    addComponentConfig: builder.mutation({
      query: (config) => ({
        url: 'configs',
        method: 'POST',
        body: config,
      }),
    }),
    updateComponentConfig: builder.mutation({
      query: ({id, config}) => ({
        url: `configs/${id}`,
        method: 'PUT',
        body: config,
      }),
    }),
    deleteComponentConfig: builder.mutation({
      query: (configID) => ({
        url: `configs/${configID}`,
        method: 'DELETE',
      }),
    }),
    getConfig: builder.query({
      query: () => '/config',
    }),
});
