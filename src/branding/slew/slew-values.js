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

const slew_values = {
   title: 'SLEW',
   subtitle: 'Second Life for Energiewende',
   icon: "slew-icon-draft.png",
   pages: {
      home: true,
      scenarios: true,
      infrastructure: false,
      users: false,
      account: false,
      api: false
   },
   links: {
      "DPsim Simulator": "https://dpsim.fein-aachen.org",
      "VILLASframework": "https://villas.fein-aachen.org/doc"
   },
   style: {
      bgcolor: 'rgba(107,29,26, 0.8)',
      highlights: '#610C04',
      maincolor: 'rgba(40,0,0,0.8)',
      primarytext: '#472120',
      secondarytext: '#472120',
      font: "16px Roboto, sans-serif",
      borderradius: "10px"
   }
}

export default slew_values;