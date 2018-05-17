import React from 'react';

import config from '../helpers/config';

var MobileUser = module.exports = {
    mobileVerification: function (mobile_number) {
        let url = config.urls.api_url + config.urls.mobile_verification_url+ "/" + mobile_number ;
        return fetch(url, {
            method: 'GET',
        }).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    },
    registerMobileUser: function (mobile_number, activation_code) {
        let url = config.urls.api_url + config.urls.register_mobile_user_url+ "/" + mobile_number + "/" + activation_code;
        return fetch(url, {
            method: 'GET',
        }).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    },
    checkMobileUser: function (user_token) {
        let url = config.urls.api_url + config.urls.check_mobile_user+ "/" + user_token ;
        return fetch(url, {
            method: 'GET',
        }).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    }
}

export default MobileUser;