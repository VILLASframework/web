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

const config = {
    publicPathBase: 'public/',
    instance: 'VILLASweb',
    subtitle: 'ACS',
    admin: {
      name: 'Institute for Automation of Complex Power Systems (ACS), RWTH Aachen University, Germany',
      mail: 'stvogel@eonerc.rwth-aachen.de'
    },
    externalAuth: true,
    loginURL: 'villas.k8s/oauth2/start?rd=villas.k8s/login/complete',
    provider: 'Jupyter',
    disableVillasLogin: false,
};

export default config
