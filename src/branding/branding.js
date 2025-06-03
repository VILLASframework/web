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

import {
  villasweb_footer,
  villasweb_home,
  villasweb_welcome,
} from "./villasweb/villasweb-functions";
import villasweb_values from "./villasweb/villasweb-values";

import { slew_home, slew_welcome } from "./slew/slew-functions";
import slew_values from "./slew/slew-values";

import {
  opalrt_footer,
  opalrt_home,
  opalrt_welcome,
} from "./opalrt/opalrt-functions";
import opalrt_values from "./opalrt/opalrt-values";

import {
  enershare_welcome,
  enershare_home,
  enershare_footer,
} from "./enershare/enershare-functions";
import enershare_values from "./enershare/enershare-values";

import {
  template_welcome,
  template_home,
  template_footer,
} from "./template/template-functions";
import template_values from "./template/template-values";

class Branding {
  constructor(brand) {
    this.brand = brand;

    this.setValues();
    this.checkValues();
    this.applyStyle();

    Branding.branding = this;
  }

  setValues() {
    switch (this.brand) {
      case "villasweb":
        this.values = villasweb_values;
        break;
      case "slew":
        this.values = slew_values;
        break;
      case "opalrt":
        this.values = opalrt_values;
        break;
      case "template":
        this.values = template_values;
        break;
      case "enershare":
        this.values = enershare_values;
        break;
      default:
        console.error(
          "Branding '" +
            this.brand +
            "' not available, will use 'villasweb' branding"
        );
        this.brand = "villasweb";
        this.values = villasweb_values;
        break;
    }
  }

  getHome(username = "", userid = "", role = "") {
    var homepage = "";
    switch (this.brand) {
      case "villasweb":
        homepage = villasweb_home(this.getTitle(), username, userid, role);
        break;
      case "slew":
        homepage = slew_home();
        break;
      case "opalrt":
        homepage = opalrt_home(this.getTitle(), username, userid, role);
        break;
      case "template":
        homepage = template_home();
        break;
      case "enershare":
        homepage = enershare_home();
        break;
      default:
        homepage = villasweb_home(this.getTitle(), username, userid, role);
        break;
    }
    return homepage;
  }

  getFooter() {
    var footer = "";
    switch (this.brand) {
      case "template":
        footer = template_footer();
        break;
      case "opalrt":
        footer = opalrt_footer();
        break;
      case 'enershare':
        footer = enershare_footer();
        break;  
      default:
        footer = villasweb_footer();
        break;
    }
    return footer;
  }

  getWelcome() {
    var welcome = "";
    switch (this.brand) {
      case "villasweb":
        welcome = villasweb_welcome();
        break;
      case "slew":
        welcome = slew_welcome();
        break;
      case "opalrt":
        welcome = opalrt_welcome();
        break;
      case "template":
        welcome = template_welcome();
        break;
      case 'enershare':
        welcome = enershare_welcome();
        break;  
      default:
        welcome = this.defaultWelcome();
        break;
    }
    return welcome;
  }

  defaultWelcome() {
    return (
      <div>
        <h1>Welcome!</h1>
        <p>This is the welcome page and you are very welcome here.</p>
      </div>
    );
  }

  // if icon cannot be found, the default favicon will be used
  changeHead() {
    // set title of document
    let title = this.getTitle();
    if (this.getSubtitle()) {
      title += " " + this.getSubtitle();
    }
    document.title = title;

    // set document icon
    if (!this.values.icon) {
      return;
    }
    var oldlink = document.getElementById("dynamic-favicon");

    var link = document.createElement("link");
    link.id = "dynamic-favicon";
    link.rel = "shortcut icon";
    link.href = "/" + this.values.icon;

    if (oldlink) {
      document.head.removeChild(oldlink);
    }
    document.head.appendChild(link);
  }

  checkValues() {
    if (!this.values.hasOwnProperty("pages")) {
      let pages = {};
      pages.home = true;
      pages.scenarios = true;
      pages.infrastructure = true;
      pages.users = true;
      pages.account = true;
      pages.api = true;

      this.values.pages = pages;
    } else {
      if (!this.values.pages.hasOwnProperty("home")) {
        this.values.pages["home"] = false;
      }
      if (!this.values.pages.hasOwnProperty("scenarios")) {
        this.values.pages["scenarios"] = false;
      }
      if (!this.values.pages.hasOwnProperty("infrastructure")) {
        this.values.pages["infrastructure"] = false;
      }
      if (!this.values.pages.hasOwnProperty("users")) {
        this.values.pages["users"] = false;
      }
      if (!this.values.pages.hasOwnProperty("account")) {
        this.values.pages["account"] = false;
      }
      if (!this.values.pages.hasOwnProperty("api")) {
        this.values.pages["api"] = false;
      }
    }
  }

  applyStyle() {
    this.changeHead();

    const rootEl = document.querySelector(":root");

    for (const [key, value] of Object.entries(this.values.style)) {
      rootEl.style.setProperty("--" + key, value);
    }
  }

  getLogo(style) {
    let image = null;

    try {
      image = (
        <img
          style={style}
          src={require("./" + this.brand + "/img/" + this.values.logo).default}
          alt={"Logo " + this.values.title}
        />
      );
    } catch (err) {
      console.error(
        "cannot find './" + this.brand + "/img/" + this.values.logo + "'"
      );
    }

    return image;
  }

  getTitle() {
    return this.values.title ? this.values.title : "No Title!";
  }

  getSubtitle() {
    return this.values.subtitle ? this.values.subtitle : null;
  }
}

var branding = new Branding(process.env.REACT_APP_BRAND);

export default branding;
