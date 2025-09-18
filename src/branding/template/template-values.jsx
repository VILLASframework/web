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

const template_values = {
  title: 'Template',
  subtitle: 'change me!',
  icon: "template_logo.svg",
  pages: {
    home: true,
    scenarios: true,
    infrastructure: true,
    users: true,
    account: true,
    api: true
  },
  links: {
    "Google": "https://www.google.com/",
    "StackOverFlow": "https://stackoverflow.com/"
  },
  style: {
    background: 'rgba(50,30,90, 0.6)',
    highlights: 'rgba(0,230,5, 0.75)',
    main: 'rgba(255,0,0, 1)',
    secondaryText: 'rgba(0,0,100, 0.8)',
    fontFamily: "Comic Sans, sans-serif",
    borderRadius: "60px"
  }
}

export default template_values;
