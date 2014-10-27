/**
 * tab 切换
 * @author matthewsun
 * @date 2014/10/27
 * @description @params options {superClass : ?,subClass : ?,currentClass : ?}
 * @link mattewsun@pptv.com
 */

define(function(require, exports, module){
    var $ = require('../zepto/zepto');
    var func = require('../core/func');

    var defaults = {
        currentClass : 'on'
    }

    var Tab = func.Class({
        init : function(options) {
            this.setup(options)
            this.bindEvents()
        },
        // 初始化参数
        setup : function(options) {
            this.options = $.extend({},defaults,options)
            this.$superNav = $('.' + this.options.superClass);
            this.$subCon = $('.' + this.options.subClass);
            this.type = this.options.type;
        },
        bindEvents : function() {
            var me = this;

            me.$superClass.on('click',function() {
                var index = $(this).index();
                me.handleEvent.call(me,index);
            })

        },
        handleEvent : function(index) {
            var me = this;

            me.showNav(index);
            me.showContent(index);
        },
        // 显示导航块
        showNav : function(index) {
            var me = this;

            me.$superNav.removeClass(me.options.currentClass);
            me.$superNav.eq(index).addClass(me.options.currentClass);
        },
        // 显示内容块
        showContent : function(index) {
            var me = this;

            me.$subCon.removeClass(me.options.currentClass);
            me.$subCon.eq(index).addClass(me.options.currentClass);
        },
        // 销毁
        destory : function() {
            var me = this;

            me.$superNav.off();
        }
    })
    
    return Tab;

})
