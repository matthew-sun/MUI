/**
 * @file mock_ajax
 * @module MUI
 */

/**
 * @class config
 */

/**
 * @method MOCK_AJAX
 * @return { name : url , ...}
 * @desc
 * mock_ajax.js，MOCK_AJAX 聚合地址页 ( json 数据格式 )，方便API的统一管理。约定：所有的API地址全部从这里获取。
 * @example
 * // 可能是长这个样子的
 * var MOCK_AJAX = {
 *      loginPPTV : 'http://user.vas.pptv.com/api/ajax/loginCms.php?app=1717wan', // 登录检测接口 对 PPTV主站     
 *      indexVideoData : 'http://m.1717wan.cn/?ajax=1&page=', // 首页精彩视频数据      
 *      scheduleListData : 'http://m.1717wan.cn/match/?ajax=1&page=', // 赛程页赛程列表数据       
 *      gamesListLiveData : 'http://m.1717wan.cn/game/list/?ajax_1=1&', // 游戏列表页直播视频数据      
 *      gamesListVideoData : 'http://m.1717wan.cn/game/list/?ajax=1&', // 游戏列表页精彩视频数据      
 *      recordsListData : 'http://m.1717wan.cn/mylottery/order?ajax=1&p=' // 赛程页赛程列表数据  
 * }
 * 
 * var MOCK_AJAX = require('./config/mock_ajax');
 *
 * $.ajax({
 *     url : MOCK_AJAX
 *     ...
 * })
 */

define(function(require, exports, module){
    var MOCK_AJAX = {

        /**
         * example
         *
         * name : url
         * (name : url)*
         */
    }

    return MOCK_AJAX ;

});