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

const kopernikus_values = {
  title: "Kopernikus Projekte",
  subtitle: "ENSURE",
  logo: "kopernikus_logo.jpg",
  pages: {
    home: true,
    scenarios: true,
    infrastructure: false,
    account: false,
    api: false,
  },
  links: {
    "DPsim Simulator": "https://dpsim.fein-aachen.org",
    VILLASframework: "https://villas.fein-aachen.org/doc",
  },
  style: {
    background: "rgba(189, 195, 199 , 1)",
    highlights: "rgba(2,36,97, 0.75)",
    main: "rgba(80,80,80, 1)",
    secondaryText: "rgba(80,80,80, 0.9)",
    fontFamily: "Roboto, sans-serif",
    borderRadius: "10px",
  },
};

export default kopernikus_values;
