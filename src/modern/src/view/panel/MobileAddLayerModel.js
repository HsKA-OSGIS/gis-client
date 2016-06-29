Ext.define('Koala.view.panel.MobileAddLayerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.k-panel-mobileaddlayer',
    data: {
        queryParamsFieldSetTitle: 'Anfrageparameter',
        wmsUrlTextFieldLabel: 'WMS-URL',
        wmsVersionContainerFieldLabel: 'Version',
        availableLayesFieldSetTitle: 'Verfügbare Layer',
        resetBtnText: 'Zurücksetzen',
        requestLayersBtnText: 'Verfügbare Layer abfragen',
        checkAllLayersBtnText: 'Alle auswählen',
        uncheckAllLayersBtnText: 'Nichts auswählen',
        addCheckedLayersBtnText: 'Ausgewählte Layer hinzufügen',
        errorIncompatibleWMS: 'Der angefragte WMS ist nicht kompatibel ' +
                'zur Anwendung',
        errorRequestFailed: 'Die angegebene URL konte nicht abgefragt ' +
                'werden',
        errorCouldntParseResponse: 'Die erhaltene Antwort konnte nicht ' +
                'erfolgreich geparst werden',
        parser: new ol.format.WMSCapabilities()
    }

});
