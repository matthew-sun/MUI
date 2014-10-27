/**
 * @author : matthewsun
 * @mail : matthew-sun@foxmail.com
 * @description : loading加载对象
 * @description : 范式 => options : {url ,callback ,?ipage}
 * @date : 2014/07/21
 */
define(function(require, exports, module){
    var $ = require('../zepto/zepto');
    var func = require('../core/func');

    var Loader = func.Class({

        /**
         * 初始化
         * 
         * @param  {[type]} options 配置选项 {url ,callback ,?ipage}
         */
        
        init : function(options) {

            this.$win = $(window) ;
            this.$doc = $(document) ;
            this.$loading = $('#J_loadmore') ;
            this.option = options ;
            this.iPage = this.option.iPage || 0; // 默认从第一页开始加载，有可能需求会从第二页加载
            this.turn = true ; //开关，防止重复触发scroll事件

            var _this = this ;
            // 初始加载页面时执行渲染数据
            _this.loadData.call(_this,_this.option.url,_this.option.callback,_this.option.cb);
            
            this.$doc.on('scroll',function() {
                if( !_this.turn ) {
                    return ;
                }
                 _this.loadData.call(_this,_this.option.url,_this.option.callback,_this.option.cb);
            })
        },
        
        /**
         * 加载数据
         * 
         * @param  {[type]}   url      请求后端地址
         * @param  {Function} callback 成功时的回调函数
         * @param  {Function} cb       回调成功时的回调函数（特殊情况需要）
         */
        
        loadData : function(url,callback,cb) {
            var 
                $loading = $('#J_loadmore') ,
                _this = this ,
                h ,
                winH ,
                scrollT ;

            h = this.$doc.height() ;
            scrollT = this.$win.scrollTop();
            winH = this.$win.height() ;
            if( (scrollT+winH+50 )<h ) {
                return ;
            }
            if( !$loading.hasClass('loading_hide') ) {
                $loading.find('.dot').show();
                $loading.find('.load_txt').html('努力加载中...');
            }
            $loading.removeClass('loading_hide');
            _this.iPage ++;
            _this.turn = false;

            func.loader({
                url : url + _this.iPage ,
                success : function(d) {
                    if(d.code) {
                        _this.iPage--;
                    }
                    callback && callback.call(_this,d);
                    cb && cb()
                },
                complete : function(XMLHttpRequest,status) { //请求完成后最终执行参数
                    if(status=='timeout'){  //超时
                        $loading.find('.dot').hide();
                        $loading.find('.load_txt').html('加载超时');
                        _this.turn = true;
                        return ;
                    }
                }
            });
        }

    })

    return Loader;

})