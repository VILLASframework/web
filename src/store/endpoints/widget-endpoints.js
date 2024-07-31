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

export const widgetEndpoints = (builder) => ({
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
});