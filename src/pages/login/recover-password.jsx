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

import Dialog from "../../common/dialogs/dialog";
import _ from 'lodash';

const RecoverPassword = ({show, onClose, config}) => {
    return (
        <Dialog
            show={show}
            title="Recover password"
            buttonTitle="Close"
            onClose={(c) => onClose(c)}
            blendOutCancel={true}
            valid={true}
        >
            <div>
            <h5>Please contact:</h5>
            <div>{_.get(config, ['contact', 'name'])}</div>
            <a href={`mailto:${_.get(config, ['contact', 'mail'])}`}>{_.get(config, ['contact', 'mail'])}</a>
            </div>
        </Dialog>
    )
}

export default RecoverPassword;