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

import { villasweb_home } from './villasweb/villasweb-home';
import villasweb_values from './villasweb/villasweb-values';

import { slew_home } from './slew/slew-home';
import slew_values from './slew/slew-values';

class Branding {
    constructor(chosenbrand) {
        /*
        // TODO: simplify; error only for "wrong" brand, not for missing brand
        var brand = _.get(brands, [chosenbrand]);
        if (!brand) {
            console.error("Branding '" + chosenbrand + "' not available, will use 'villasweb' branding");
            brand = _.get(brands, ['villasweb']);
            chosenbrand = 'villasweb';
            this.default = true;
        } else if (chosenbrand === 'villasweb') {
            this.default = true;
        } else {
            this.default = false;
        }
        *****/

        this.brand = chosenbrand;
        this.setValues();
    }

    static instance = Branding.instance || new Branding(process.env.REACT_APP_BRAND);

    setValues() {
        switch(this.brand) {
            case 'villasweb':
                this.values = villasweb_values;
                break;
            case 'slew':
                this.values = slew_values;
                break;
            default:
                this.values = villasweb_values;
                break;
        }
    }

    getHome(username = '', userid = '', role = '') {
        var homepage = '';
        switch (this.brand) {
            case 'villasweb':
                homepage = villasweb_home(this.values.title, username, userid, role);
                break;
            case 'slew':
                homepage = slew_home(this.values.title);
                break;
            default:
                homepage = villasweb_home();
                break;
        }
        return homepage;
    }

    getBackgroundColor() {
        if (this.values.style && this.values.style.bgcolor) {
            return this.values.style.bgcolor;
        }
        return null;
    }

    getHighlightColor() {
        if (this.values.style && this.values.style.highlights) {
            return this.values.style.highlights;
        }
        return null;
    }

    getPrimaryTextColor() {
        if (this.values.style && this.values.style.primarytext) {
            return this.values.style.primarytext;
        }
        return null;
    }

    getSecondaryTextColor() {
        if (this.values.style && this.values.style.secondarytext) {
            return this.values.style.secondarytext;
        }
        return null;
    }

    getFont() {
        if (this.values.style && this.values.style.font) {
            return this.values.style.secondarytext;
        }
        return null;
    }
};


export default Branding;