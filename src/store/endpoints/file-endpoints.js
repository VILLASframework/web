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

export const fileEndpoints = (builder) => ({
  getFiles: builder.query({
    query: (scenarioID) => ({
      url: "files",
      params: { scenarioID },
    }),
  }),
  addFile: builder.mutation({
    query: ({ scenarioID, file }) => {
      const formData = new FormData();
      formData.append("file", file);
      return {
        url: `files?scenarioID=${scenarioID}`,
        method: "POST",
        body: formData,
      };
    },
  }),
  downloadFile: builder.query({
    query: (fileID) => ({
      url: `files/${fileID}`,
      responseHandler: "blob",
      responseType: "blob",
    }),
  }),
  downloadImage: builder.query({
    query: (fileID) => ({
      url: `files/${fileID}`,
      method: "GET",
      responseHandler: (response) => response.blob(),
    }),
  }),
  updateFile: builder.mutation({
    query: ({ fileID, file }) => {
      const formData = new FormData();
      formData.append("file", file);
      return {
        url: `files/${fileID}`,
        method: "PUT",
        body: formData,
      };
    },
  }),
  deleteFile: builder.mutation({
    query: (fileID) => ({
      url: `files/${fileID}`,
      method: "DELETE",
    }),
  }),
});
