/**
 * @file mock_ajax
 * @module MUI
 */

/**
 * @class config
 */

/**
 * @method API
 * @return { name : url , ...}
 * @desc
 * mock_ajax.js，API 聚合地址页 ( json 数据格式 )，方便API的统一管理。约定：所有的API地址全部从这里获取。
 * @example
 * var MOCK_AJAX = require('./config/mock_ajax');
 *
 * $.ajax({
 *     url : MOCK_AJAX
 *     ...
 * })
 */

define(function(require, exports, module){
    var API = {

        /**
         * example
         *
         * name : url
         * (name : url)*
         */
    }

    return API ;

});