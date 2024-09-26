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

export const usergroupEndpoints = (builder) => ({
    getUsergroups: builder.query({
      query: () => 'usergroups',
    }),
    getUsergroupById: builder.query({
      query: (usergroupID) => `/usergroups/${usergroupID}`,
    }),
    addUsergroup: builder.mutation({
      query: (usergroup) => ({
        url: '/usergroups',
        method: 'POST',
        body: {
          userGroup: usergroup
        },
      }),
    }),
    updateUsergroup: builder.mutation({
      query: ({ usergroupID, usergroup }) => ({
        url: `/usergroups/${usergroupID}`,
        method: 'PUT',
        body: { usergroup },
      }),
    }),
    addUserToUsergroup: builder.mutation({
      query: ({ usergroupID, username }) => ({
        url: `/usergroups/${usergroupID}/user`,
        method: 'PUT',
        params: { username },
      }),
    }),
    deleteUserFromUsergroup: builder.mutation({
      query: ({ usergroupID, username }) => ({
        url: `/usergroups/${usergroupID}/user`,
        method: 'DELETE',
        params: { username },
      }),
    }),
    getUsersByUsergroupId: builder.query({
      query: (usergroupID) => `/usergroups/${usergroupID}/users`,
    }),
    deleteUsergroup: builder.mutation({
      query: (usergroupID) => ({
        url: `usergroups/${usergroupID}`,
        method: 'DELETE',
      }),
    }),
});
