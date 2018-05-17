import React from 'react';
import { AsyncStorage } from 'react-native';

import config from '../helpers/config';

var Subscribe = module.exports = {
    getProductSubscribe: function (user_id) {
        let url = config.urls.api_url + config.urls.get_product_subscribe +"/"+ user_id;
        return fetch(url, {
            method: 'GET',
        }).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    },
    subscribeProduct: function(data){
        let product_url = config.urls.api_url+config.urls.subscribe_product;

        var headers = new Headers();
        headers.append("content-type","application/json");

        var request = new Request(product_url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        return fetch(request).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    }
}

export default Subscribe;