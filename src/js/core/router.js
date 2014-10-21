/**
 * @author : matthewsun
 * @mail : matthew-sun@foxmail.com
 * @description : MUI框架的路由控制
 * @date : 2014/10/21
 */
define(function(require, exports, module){
    var $ = require('../zepto/zepto');
    var func = require('./func');
    var itpl = require('./itpl');

    var Router = func.Class(function() {

        init : function() {},

        /**
         * 路径缓存
         * 
         * @type {Object}
         */
        
        cache : {} ,

        /**
         * 路由管控
         * 
         * @param  {[type]} path    hash地址
         * @param  {[type]} options {
         *                              templateUrl : ?
         *                              templateData : ? 
         *                           }
         * 
         * @return {[type]}         router对象
         */
        
        when : function(path, options) {

            this.cache[path] = options;
            onHashChange();
            this.load(path);

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

            if( !isHash(path) ) {
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
            var tpl = this.fetchTpl(path);
            var data = this.cache[path].templateData;
            var renderHtml = itpl(tpl,data);

            $('#mui_view').html( renderHtml );
        },

        /**
         * 获取模板数据
         * 
         * @param  {[type]} path 路径
         * @return {[type]}      html模板
         */
        
        fetchTpl : function(path) {
            var me = this;
            $.get('../' + me.cache[path].templateUrl,
                function(response){
                    return response;
                }
            )
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

            window.onhashchange = function() {
                me.load(location.hash.substring(1));
            }
        },

        /**
         * toDo 
         * loading 转场等待渲染页面
         */
        loading : function() {}

    });
    
    return Router;
    
})