import React from 'react';
import config from '../helpers/config';

var Product = module.exports = {
    getProducts: function () {
        let url = config.urls.api_url + config.urls.get_products_url;
        return fetch(url, {
            method: 'GET',
        }).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    },
    getProductDetail: function (product_id, country_id) {
        let url = config.urls.api_url + config.urls.get_product_detail_url + "/" + product_id + "/" + country_id;
        return fetch(url, {
            method: 'GET',
        }).then(function (res) {
            return res;
        }).catch(function (err){
            return err;
        })
    }
}

export default Product;