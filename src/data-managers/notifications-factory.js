/**
 * File: notifications-factory.js
 * Description: An unique source of pre-defined notifications that are displayed
 *              throughout the application.
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 13.04.2017
 * Copyright: 2018, Institute for Automation of Complex Power Systems, EONERC
 *
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

class NotificationsFactory {

    static get NO_SIM_MODEL_AVAILABLE() {
        return {
            title: 'No simulation model available',
            message: 'Consider defining a simulation model in the simulators section.',
            level: 'warning'
        };
    }

}

export default NotificationsFactory;
