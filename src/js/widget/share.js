/**
 * @author : matthewsun
 * @mail : matthew-sun@foxmail.com
 * @description : 移动端自定义分享组件
 * @description : 范式 new Share(cfg) cfg ==> {'title' : '?','url' : '?','img' : '?'}
 * @date : 2014/08/07
 */

define(function(require, exports, module){
    var $ = require('../zepto/zepto');
    var func = require('../core/func');
    var itpl = require('../core/itpl');
    
    var defaults = {
        shareDom : '#J_share' ,
        title : document.title, // 分享的标题
        url : window.location.href , // 分享的链接
        content:'', // 分享的详细内容，可选，仅部分分享支持此属性
        appkey:'',
        img : '' // 需要分享图片地址，可选
        //callback 分享之后的回调函数 
    }

    var Share = func.Class({

        init : function(cfg) {
            var cfg = this.cfg = $.extend({},defaults,cfg);
            this.$el = $(this.cfg.shareDom);
            var tpl = {
                tsina : 'http://service.weibo.com/share/share.php?appkey=&url={{url}}&title={{title}}&content={{content}}&pic={{img}}',
                tqq : 'http://share.v.t.qq.com/index.php?c=share&a=index&title={{title}}&url={{url}}&appkey=801514069&pic={{img}}',
                tqzone : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title={{title}}&url={{url}}&pics={{img}}&summary={{title}}&site=1717wan' 
            }    
            this.SHAREAPI = {
                tsina : itpl.render(tpl.tsina,cfg),
                tqq : itpl.render(tpl.tqq,cfg),
                tqzone : itpl.render(tpl.tqzone,cfg)
                // tbaidu : 'http://tieba.baidu.com/f/commit/share/openShareApi?url='+ this.cfg.url +'&title='+ this.cfg.title +'&pic=' + this.cfg.img
            }
            this.bind4Events();
        },

        /**
         * 事件绑定
         */

        bind4Events : function() {
            var _this = this,
                $shareIcon = this.$el.find('a');
            $shareIcon.on('click',function() {
                var platform = $(this).data('name') || $(this).attr('data-name');
                _this.handler4Share(platform);
            })
        },

        /**
         * 发送分享请求
         * 
         * @param  {[type]} name 分享的平台
         */
        
        handler4Share : function(name) {
            var _this = this;
            window.location.assign(_this.SHAREAPI[name]);
            _this.cfg.callback && _this.cfg.callback();
        },

        destory : function() {
            var $shareIcon = this.$el.find('a');
            $shareIcon.off();
        }

    })

    return Share;

})