import React from 'react';
import { AsyncStorage } from 'react-native';

import config from '../helpers/config';

var common = module.exports = {
    getCountires: function () {
        let url = config.urls.api_url + config.urls.get_countires_url;
        return fetch(url, {
            method: 'GET',
        }).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    },
    getLanguages: function () {
        let url = config.urls.api_url + config.urls.get_languages_url;
        return fetch(url, {
            method: 'GET',
        }).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    },
    getSlideImages: function () {
        let url = config.urls.api_url + config.urls.get_slideimages_url;
        return fetch(url, {
            method: 'GET',
        }).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    },
    getLocalization: function (language_id) {
        let url = config.urls.api_url + config.urls.get_localization_url + "/" + language_id;
        return fetch(url, {
            method: 'GET',
        }).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    },
    getConfig: function (language_id) {
        let url = config.urls.api_url + config.urls.get_config;
        return fetch(url, {
            method: 'GET',
        }).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    }
}

export default common;