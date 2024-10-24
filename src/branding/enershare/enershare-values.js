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

const enershare_values = {
  title: 'Digital Twin for flexible energy networks',
  subtitle: '',
  icon: "logo_Enershare_Icon.svg",
  logo: "logo_Enershare.svg",
  pages: {
    home: true,
    scenarios: true,
    infrastructure: true,
    users: true,
    account: true,
    api: true
  },
  links: {
    "AppStore": "https://store.haslab-dataspace.pt/gui/",
    "The Project": "https://enershare.eu/"
  },
  style: {
    background: 'rgba(24,229,176, 0.6)',
    highlights: 'rgba(153,102,255, 0.75)',
    main: 'rgba(0,0,0, 1)',
    secondaryText: 'rgba(0,0,100, 0.8)',
    fontFamily: "Manrope, sans-serif",
    borderRadius: "60px"
  }
}

export default enershare_values;
