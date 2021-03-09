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

import brands from './brands'
import config from '../config'
import _ from 'lodash';

import { villasweb_home } from './villasweb/villasweb-home';
import { slew_home } from './slew/slew_home';


class Branding {
    constructor(chosenbrand) {
        var brand = _.get(brands, [chosenbrand]);
        if (!brand) {
            console.error("Branding '" + chosenbrand + "' not available, will use 'villasweb' branding");
            brand = _.get(brands, ['villasweb']);
            chosenbrand = 'villasweb'
        }

        this.brand = brand;
        this.name = chosenbrand;
    }

    static instance = Branding.instance || new Branding(config.branding);

    getHome(username = '', userid = '', role = '') {
        var homepage = '';
        switch (this.name) {
            case 'villasweb':
                homepage = villasweb_home(this.brand.title, username, userid, role);
                break;
            case 'slew':
                homepage = slew_home(this.brand.title);
                break;
            default:
                homepage = villasweb_home();
                break;
        }
        return homepage;
    }

    getBackgroundColor() {
        if (this.brand.style && this.brand.style.bgcolor) {
            return this.brand.style.bgcolor;
        }
        return null;
    }

    getHighlightColor() {
        if (this.brand.style && this.brand.style.highlights) {
            return this.brand.style.highlights;
        }
        return null;
    }

    getPrimaryTextColor() {
        if (this.brand.style && this.brand.style.primarytext) {
            return this.brand.style.primarytext;
        }
        return null;
    }

    getSecondaryTextColor() {
        if (this.brand.style && this.brand.style.secondarytext) {
            return this.brand.style.secondarytext;
        }
        return null;
    }
};


export default Branding;