/**
 * @author : matthewsun
 * @mail : matthew-sun@foxmail.com
 * @description : 图片懒加载
 * @description : Lazyload() 页面初始化加载图片懒加载模块
 * @description : Lazyload({showOnce : true}) 动态执行一次懒加载模块
 * @date : 2014/08/06
 */

/**
 * @file lazyload
 * @module MUI
 */

/**
 * @class widget
 */

/**
 * @method Lazyload
 * @grammar Lazyload();
 * @desc
 * 页面初始化加载图片懒加载模块
 * @example
 * html:
 * 
 * <img class="lazy" src="真实地址" lazyimg="临时地址">
 * 
 * javascript:
 * 
 * var lazyload = require('./widget/lazyload');
 * lazyload();
 * 
 */

define(function(require, exports, module){
    var $ = require('../zepto/zepto');
    var func = require('../core/func');

    var defaults = {
        preViewHeight : 100 ,// 预加载距离
        showOnce : false // 默认初始化加载懒加载模块加绑定事件
    }

    var Lazyload = func.Class({

        init : function(opts) {
            this.$win = $(window);
            this.opts = $.extend({},defaults,opts);
            this.preViewHeight = this.opts.preViewHeight;

            if(this.opts.showOnce) {
                this.handler4ShowImg();
            }else {
                this.handler4ShowImg();
                this.bind4Events();
            }

        },

        bind4Events : function() {

                      // 页面滚动时触发懒加载
            this.$win.on('scroll',$.proxy(this.handler4ShowImg,this))
                      // 调整大小时触发懒加载
                     .on('resize',$.proxy(this.handler4ShowImg,this));
                     
        },

        /**
         * 未滚动时当前视窗是否懒加载
         */
        
        handler4ShowImg : function() {
            var _this = this;

            $('img.lazy').each(function(){
                var $this = $(this);
                if( !$this.attr('lazyimg') ) return ;
                if( _this.inViewport($this) ) {
                    _this.showImg($this);
                }
            })

        },

        /**
         * 不判断是否在可视区范围内，lazy图片全部加载
         */
        
        handler4ShowAllImg : function() {
            var _this = this;

            $('img.lazy').each(function(){
                var $this = $(this);
                if( !$this.attr('lazyimg') ) return ;
                _this.showImg($this);

            })
        },

        /**
         * 要加载的图片是不是在指定窗口内
         * 
         * @param  {[type]} el DOM对象
         * @return {[type]}    布尔值
         */
        
        inViewport : function( el ) {
            var top = this.$win.scrollTop(),    // 窗口的顶部
                btm = top + this.$win.height(),    // 窗口的底部
                elTop = el.offset().top-this.preViewHeight,    // 当前元素top值+预加载100px
                imgHeight = el.height();    // 当前元素的高度

            return elTop>=top-imgHeight && elTop<=btm;
        },

        /**
         * 显示图片
         * 
         * @param  {[type]} el DOM对象
         * @return {[type]}    [description]
         */
        
        showImg : function( el ){
            if( el.attr('loaded') ) return ;
            var img = new Image(), original = el.attr('lazyimg');
            img.onload = function() {
                el.attr('src',original).removeClass('lazy');
            }
            original && (img.src = original);
            el.attr('loaded',true);

        },

        /**
         * 销毁lazyload
         */
        
        destory : function() {
            this.$win.off();
        }

    })

    return Lazyload;

})