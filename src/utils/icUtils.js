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

export const isICOutdated = (component) => {
  if (!component.stateUpdateAt) return true;

  const fiveMinutes = 5 * 60 * 1000;

  return Date.now() - new Date(component.stateUpdateAt) > fiveMinutes;
};

export const downloadGraph = async (url) => {
  let blob = await fetch(url).then((r) => r.blob());
  FileSaver.saveAs(blob, this.props.ic.name + ".svg");
};
