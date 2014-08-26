/**
 * @author : matthewsun
 * @mail : matthew-sun@foxmail.com
 * @description : 移动端自定义分享组件
 * @description : 范式 new Share(cfg) cfg ==> {'title' : '?','url' : '?','img' : '?'}
 * @date : 2014/08/07
 */

define(function(require, exports, module){
    var $ = require('zepto');
    
    var defaults = {
        shareDom : '#J_share' ,
        title : document.title, // 分享的标题
        url : window.location.href , // 分享的链接
        content:'', //分享的详细内容，可选，仅部分分享支持此属性
        appkey:'',
        img : '' // 需要分享图片地址，可选
        //callback 分享之后的回调函数 
    }

    function Share() {
        this.init.apply(this,arguments);
    }

    Share.prototype =  {
        constructor : Share ,

        init : function(cfg) {
            this.cfg = $.extend({},defaults,cfg);
            this.$el = $(this.cfg.shareDom);    
            this.SHAREAPI = {
                tsina : 'http://service.weibo.com/share/share.php?appkey=&url=' + this.cfg.url + '&title=' + this.cfg.title + '&content=' + this.cfg.content + '&pic=' + this.cfg.img ,
                tqq : 'http://share.v.t.qq.com/index.php?c=share&a=index&title=' + this.cfg.title + '&url=' + this.cfg.url + '&appkey=801514069' + '&pic=' + this.cfg.img,
                tqzone : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title='+ (this.cfg.qzoneTitle || this.cfg.title) + '&url='+ this.cfg.url +'&pics='+ this.cfg.img +'&summary='+ this.cfg.title +'&site=1717wan' 
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
            $shareIcon.on('tap',function() {
                var platform = $(this).data('name') || $(this).attr('data-name');
                _this.handler4Share(platform);
            })
        },

        /**
         * 发送分享请求
         * @param  {[type]} name 分享的平台
         */
        
        handler4Share : function(name) {
            var _this = this;
            window.location.assign(_this.SHAREAPI[name]);
            _this.cfg.callback && _this.cfg.callback();
        }
    }

    return Share;

})