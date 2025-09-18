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

// import NotificationsDataManager from "../data-managers/notifications-data-manager";
// import NotificationsFactory from "../data-managers/notifications-factory";

// Check if the error was due to network failure, timeouts, etc.
// Can be used for the rest of requests
function isNetworkError(err, url) {
  let result = false;

  if (err.status === 500 && err.response != null) {
    console.log("500 error:", err.response);
    if (err.response.text.includes("ECONNREFUSED")) {
      let notification = NotificationsFactory.SERVER_NOT_REACHABLE(
        err.response.text,
        url
      );
      NotificationsDataManager.addNotification(notification);
      result = true;
    } else {
      let notification = NotificationsFactory.INTERNAL_SERVER_ERROR(
        err.response
      );
      NotificationsDataManager.addNotification(notification);
    }
  } else if (err.status == null || err.status === 500 || err.response == null) {
    // If not status nor response fields, it is a network error. TODO: Handle timeouts
    result = true;
    let notification = err.timeout
      ? NotificationsFactory.REQUEST_TIMEOUT
      : NotificationsFactory.SERVER_NOT_REACHABLE("", url);
    NotificationsDataManager.addNotification(notification);
  }
  return result;
}

let prevURL = null;

class RestAPI {
  async get(url, token) {
    return fetch(url, {
      headers: token ? { Authorization: "Bearer " + token } : {},
    }).then((res) => {
      if (!res.ok) {
        const error = new Error(`Response status: ${res.status}`);
        error.handled = isNetworkError(error);
        throw error;
      }
      return res.json();
    });
  }

  async post(url, body, token, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
        .then(async (res) => {
          clearTimeout(timer);
          if (!res.ok) {
            throw new Error(`Response status: ${res.status}`);
          }
          return res.json();
        })
        .then(resolve)
        .catch(reject);
    });
  }

  async delete(url, token) {
    return fetch(url, {
      method: "DELETE",
      headers: token ? { Authorization: "Bearer " + token } : {},
    }).then((res) => {
      if (!res.ok) {
        const error = new Error(`Response status: ${res.status}`);
        error.handled = isNetworkError(error);
        throw error;
      }
      return res.json();
    });
  }

  async put(url, body, token) {
    return fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) {
        const error = new Error(`Response status: ${res.status}`);
        error.handled = isNetworkError(error);
        throw error;
      }
      return res.json();
    });
  }

  upload(url, data, token, progressCallback, scenarioID) {
    return new Promise(function (resolve, reject) {
      const req = request
        .post(url + "?scenarioID=" + scenarioID)
        .send(data)
        .on("progress", progressCallback);

      if (token != null) {
        req.set("Authorization", "Bearer " + token);
      }

      req.end(function (error, res) {
        if (res == null || res.status !== 200) {
          error.handled = isNetworkError(error);
          reject(error);
        } else {
          resolve(JSON.parse(res.text));
        }
      });
    });
  }

  async download(url, token, fileID) {
    return fetch(`${url}/${fileID}${token ? `?token=${token}` : ""}`).then(
      async (res) => {
        if (!res.ok) {
          const error = new Error(`Response status: ${res.status}`);
          error.handled = isNetworkError(error);
          throw error;
        }
        const blob = await res.blob();
        const type =
          res.headers.get("Content-Type") || "application/octet-stream";
        const parts = url.split("/");
        return {
          data: blob,
          type: type,
          id: parts[parts.length - 1],
        };
      }
    );
  }

  async apiDownload(url, token) {
    return fetch(url, {
      headers: token ? { Authorization: "Bearer " + token } : {},
    })
      .then((res) => {
        if (!res.ok) {
          const error = new Error(`Response status: ${res.status}`);
          error.handled = isNetworkError(error);
          throw error;
        }
        return res.blob().then((blob) => {
          const type = response.headers.get("Content-Type");
          return [blob, type];
        });
      })
      .then(([blob, type]) => {
        const parts = url.split("/");
        return {
          data: blob,
          type: type || "application/octet-stream",
          id: parts[parts.length - 1],
        };
      });
  }
}

export default new RestAPI();
