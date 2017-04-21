/**
 * File: notifications-factory.js
 * Description: An unique source of pre-defined notifications that are displayed 
 *              throughout the application.
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 13.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

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