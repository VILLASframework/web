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

const templateB = {
    id: 2,
    name: "Template B",
    type: "object",
    definitions: {
      uint: {
        type: "integer",
        minimum: 0
      },
    },
    properties: {
      name: { type: "string", title: "Name", default: "Template B" },
      description: { type: "string", title: "Description", default: "Description for Template B" },
      paramB: {
        title: "MyParam B",
        enum: [
          "option1",
          "option2",
          "option3"
        ],
        enumNames: [
          "Option 1",
          "Option 2",
          "Option 3"
        ]
      },
      minLength: { type: "integer", title: "Minimum Length", minimum: 0, default: 0 }
    }
  };

  export default templateB;