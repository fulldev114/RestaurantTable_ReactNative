import React from 'react';
import { AsyncStorage } from 'react-native';

import config from '../helpers/config';
import common from '../services/common-service';

var localize = module.exports = {
    callLocalizeAPI: function (language_id, cb) {
        common.getLocalization(language_id).then(function (resJson) {
            if (resJson.status == 200) {
                resJson.json().then((localize_data)=>{
                    if(localize_data.status){
                        localize.prepareLocalize(localize_data);
                        cb({st:1});
                    }else{
                        cb({st:0, message:localize_data.message});
                    }
                });
            }
        })
    },
    prepareLocalize: function (localize_data) {
        let newLocalize = {}
        for (var key in localize_data.localization) {
            if (localize_data.localization.hasOwnProperty(key)) {
                newLocalize[key] = localize_data.localization[key]['localize'];
            }
        }
        AsyncStorage.setItem('localization',JSON.stringify(newLocalize));
    },
    getLocalization: function(){
        return AsyncStorage.getItem('localization');
    },
    formatLocalization: function(defaultLocalize, localizeData){
        let newLocalize = {}
        for (var key in defaultLocalize) {
            if (defaultLocalize.hasOwnProperty(key)) {
                if(localizeData.hasOwnProperty(key)){
                    newLocalize[key] = localizeData[key]
                }else{
                    newLocalize[key] = defaultLocalize[key];
                }
            }
        }
        return newLocalize;
    }
}

export default localize;