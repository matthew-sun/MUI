/**
 * @file router
 * @import zepto.js,func.js,template.js
 * @module MUI
 */

/**
 * router.js，MUI框架的路由控制。
 * @class router
 */

define(function(require, exports, module){
    var $ = require('../zepto/zepto');
    var func = require('./func');
    var template = require('../template/template');

    var Router = func.Class({

        init : function() {
            this.onHashChange();
        },

        /**
         * 路径缓存
         * 
         * @type {Object}
         */
        
        cache : {} ,

        /**
         * 路由控制
         * 
         * @param  {[type]} path    hash地址
         * @param  {[type]} options {
         *                              templateId : ?
         *                              templateData : ? 
         *                              controller : ?
         *                              title : ?
         *                           }
         * 
         * @return {[type]}         router对象
         */
        
        when : function(path, options) {

            this.cache[path] = options;

            this.load(path);

            return this;
        },

        /**
         * 默认跳转的链接
         * 
         * @param  {[type]} options {
         *                              templateUrl : ?
         *                              templateData : ? 
         *                              controller : ?
         *                           }
         * 
         * @return {[type]}         router对象
         */
        otherwise : function(options) {

            this.cache['otherwiseSpecialTpl'] = options;
            this.load('otherwiseSpecialTpl');

            return this;
        },

        /**
         * page加载
         * 
         * @param  {[type]} path 路径
         */
        
        load : function(path) {
            var hash = location.hash;

            if( hash.substring(0,2) !== '#/' ) {
                location.hash = '#/';
            }

            // hash值不在缓存列表里，执行otherwise跳转
            if( !this.cache[location.hash.substring(1)] ) {
                if( this.cache['otherwiseSpecialTpl'] ) {
                    this.render('otherwiseSpecialTpl');
                }
                return ;
            }

            // 当前hash不是当前匹配的path，return
            if( !this.isHash(path) ) {
                return ;
            }

            this.render(path);

        },

        /**
         * 渲染摸板
         * 
         * @param  {[type]} path 路径
         */
        
        render : function(path) {

            var $view = $('#mui_view');
            var data = this.cache[path].templateData || {};
            var me = this;

            // 载入loading画面
            me.loading();

            if( this.cache[path].title ) {
                document.title = this.cache[path].title;
            }

            var renderHtml = template(me.cache[path].templateId,data);
            $view.html( renderHtml );

            me.cache[path].controller && me.cache[path].controller();

        },

        /**
         * 数据改变时重新渲染模板
         * 
         * @param  {[type]} path 路径
         * @param  {[type]} data 新的数据
         */
        
        dataChangeReload : function(path, data) {
            this.cache[path].templateData = data;
            this.load(path);
        },

        /**
         * 判断当前hash与路径是否匹配
         * 
         * @param  {[type]}  path 路径
         * @return {Boolean}      真假值
         */
        
        isHash : function(path) {
            var hash = location.hash;

            return !!(hash.substring(1) === path)
        },

        /**
         * 绑定hashchange事件
         */
        
        onHashChange : function() {
            var me = this;

            window.addEventListener('hashchange',function() {
                me.load(location.hash.substring(1));
            },false)
        },

        /**
         * loading 转场等待渲染页面
         */
        loading : function() {
            var $view = $('#mui_view');
            var loadingHtml = '<div class="loading_view"></div>';

            $view.html(loadingHtml);
        }

    });
    
    return Router;
    
})

/**
 * @method when
 * @grammar router().when(url, {templateId : ?, templateData : ? , controller : ?})
 * @param {String} url 浏览器hash路由值，url#后的值，默认 url#{0,1} 跳转至url#/。
 * @param {Json} options {templateId(必选) : ?, templateData(可选) : ?, controller(可选) : ?}
 * @desc 当window的url的hash值是什么时，选择什么模板进行渲染。
 * - templateId   ： 模板ID
 * - templateData ： 模板数据
 * - controller   ： 模板加载之后，执行的js回调
 * - title        ： 页面的标题
 * @example
 * var INDEX_DATA = {
 *     title : '首页' ,
 *     list : [
 *         {
 *             url : 'http://www.fehouse.com' ,
 *             title : '前端家园'
 *         },
 *         {
 *             url : 'http://www.1717wam.cn' ,
 *             title : '1717wan'
 *         }
 *     ]
 * }
 *
 * function hello() {
 *     alert('你好，小明！');
 * }
 *
 * router().when('/',{
 *     templateId : 'index',
 *     templateData : INDEX_DATA,
 *     title : 'index'
 * }).when('/about',{
 *     templateId : 'about',
 *     controller : hello
 * })
 * 
 */

/**
 * @method otherwise
 * @grammar router().otherwise({templateId : ?, templateData : ? , controller : ?})
 * @param {Json} options {templateId(必选) : ?, templateData(可选) : ?, controller(可选) : ?}
 * @desc 路由默认跳转地址
 * @example
 * router().otherwise({
 *     templateId : '404'
 * })
 */

/**
 * @method dataChangeReload
 * @grammar router().dataChangeReload(path, data)
 * @param {String} path 模板id
 * @param {Json} data 模板数据
 * @desc 数据发生改变时重新渲染
 * @example
 * router().dataChangeReload('index',{
 *     title : 'title has changed.'
 * })
 */