/**
 * @file dialog
 * @module MUI
 */

/**
 * @class widget
 */

/**
 * @method dialog
 * @grammar dialog({id, pushHtml, type});
 * @param {Json} options 配置选项
 * @param {String} id 弹层包裹id
 * @param {String} pushHtml 如果需要把弹层插入页面，则需要填入pushHtml
 * @param {String} type 默认展示特效为none，可选参数none, fade
 * @desc
 * 弹窗
 * @example
 * var dialog = require('./widget/dialog');
 *
 * dialog({
 *     id : 'J_overlay',
 *     type : 'fade'
 * });
 * 
 */

/**
 * @method dialog().show
 * @desc
 * 弹窗显示
 * @example
 * var dialog = require(./widget/dialog);
 *
 * dialog({
 *     id : 'J_overlay',
 *     type : 'fade'
 * }).show();
 * 
 */

/**
 * @method dialog().hide
 * @desc
 * 弹窗显示
 * @example
 * var dialog = require(./widget/dialog);
 *
 * dialog({
 *     id : 'J_overlay',
 *     type : 'fade'
 * }).hide();
 * 
 */

define(function(require, exports, module){
    var $ = require('../zepto/zepto');
    var func = require('../core/func');

    var defaults = {
        type : 'none',
        htype : 'hide'
    }

    // 展示特效
    var showEffect = {
        none : function(el) {
            el.addClass('lay_on').find('.modal').show();
        },
        fade : function(el) {
            el.addClass('lay_on').css('opacity',0).find('.modal').show();
            el.animate({
                opacity : 1
            },200)
        }
    }

    // 隐藏特效
    var hideEffect = {
        none : function(el,htype) {
            if( htype === 'hide') {
                el.removeClass('lay_on').find('.modal').hide();
            }else {
                el.remove();
            }
        },
        fade : function(el,htype) {
            if( htype === 'hide') {
                el.animate({
                    opacity : 0
                },200,function() {
                    el.removeClass('lay_on').find('.modal').hide();
                })    
            }else {
                el.animate({
                    opacity : 0
                },200,function() {
                    el.remove();
                })
            }
        }
    }

    /**
     * 弹层组件
     */
   
     var Dialog = func.Class({
        // 初始化
        init : function(option) {
            var option = this.option = $.extend({},defaults,option);
            this.type = option.type;
            this.htype = option.htype;
            if(option.pushHtml) {
                this.htype = 'remove';
                $('body').append(option.pushHtml);
            }
            this.$el = $('#'+option.id);
            this.bindEvent();
        },
        bindEvent : function() {

            // 阻止遮罩滚动
            this.$el.on('touchmove',function(ev) {
                ev.preventDefault();
            });

            // 点击其他位置隐藏弹层
            this.$el.on('click',$.proxy(this.handler4RemoveMask,this));

        },
        handler4RemoveMask : function(ev) {
            ev.stopPropagation();
            var self = this;
            if( ev.target.id === this.option.id ) {
                self.hide();
            }
        },
        show : function() {
            showEffect[this.type].call(this,this.$el);
        },
        hide : function() {
            hideEffect[this.type].call(this,this.$el,this.htype);
        },
        destory : function() {
            this.$el.off();
            this.$el.remove();
        }

     })

    return Dialog;

})