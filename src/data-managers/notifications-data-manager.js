/**
 * File: notifications-data-manager.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 21.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

class NotificationsDataManager {
  _notificationSystem = null;

  setSystem(notificationSystem) {
    this._notificationSystem = notificationSystem;
  }

  addNotification(notification) {
    this._notificationSystem.addNotification(notification);
  }
}

export default new NotificationsDataManager();
