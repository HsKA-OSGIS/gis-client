/* Copyright (c) 2017-present terrestris GmbH & Co. KG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @class Koala.view.component.CartoWindowModel
 */
Ext.define('Koala.view.component.CartoWindowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.k-component-cartowindow',

    data: {
        /*i18n start*/
        autorefresh: '',
        autorefreshExpand: '',
        autorefreshMove: '',
        autorefreshOptions: '',
        info: '',
        toggleLegendVisibility: '',
        exportToPngText: '',
        toggleGrouping: '',
        toggleUncertainty: '',
        displayIdentificationThreshold: '',
        irixPrintText: '',
        irixPrintTooltip: '',
        /*i18n end*/
        lineFeature: null,
        lineLayer: null,
        overlay: null,
        tabs: []
    }

});
