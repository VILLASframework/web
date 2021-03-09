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

const brands = {
   villasweb: {
      title: 'VILLASweb',
      subtitle: 'ACS',
      logo: 'villas_web.svg',
      pages: {
         home: true,
         scenarios: true,
         infrastructure: true,
         users: true,
         account: true,
         api: true,
      },
      style: {
         bgcolor: '#6EA2B0',
         highlights: '#527984',
         primarytext: '#4d4d4d',
         secondarytext: '#818181',
      }
   },
   slew: {
      title: 'SLEW',
      subtitle: 'Second Life for Energiewende',
      logo: "slew-logo.png",
      icon: "/slew_icon.png",
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
         bgcolor: '#900603',
         highlights: '#610C04',
         primarytext: '#420C09',
         secondarytext: '#710C04',
         font: "16px Roboto, sans-serif",
      }
   },
   test: {
      title: 'SLEW',
      subtitle: 'Second Life for Energiewende',
      logo: "slew-logo.png",
      pages: {
         home: true,
         scenarios: true,
         infrastructure: false,
         users: false,
         account: false,
         api: false
      },    
   }
}

export default brands;