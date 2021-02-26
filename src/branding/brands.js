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
      links: {
         "VILLASframework project": "http://fein-aachen.org/projects/villas-framework/",
         "VILLASweb Documentation": "https://villas.fein-aachen.org/doc/web.html",
         "VILLASweb frontend source": "https://git.rwth-aachen.de/acs/public/villas/web",
         "VILLASweb backend source":"https://git.rwth-aachen.de/acs/public/villas/web-backend-go",
      }
   },
   slew: {
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
      links: {
         "DPsim Simulator": "https://dpsim.fein-aachen.org",
         "VILLASframework": "https://villas.fein-aachen.org/doc"
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