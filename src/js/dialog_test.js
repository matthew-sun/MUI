/**
 * @author : matthewsun
 * @mail : matthew-sun@foxmail.com
 * @description : 封装一些与业务无关的底层方法
 * @description : CLASS || EVENT || HTTP || MOBILE
 * @date : 2014/08/25
 */
define(function(require, exports, module){
    var $ = require('./zepto/zepto');
    
    var fastclick = require('./core/fastclick');
    var itpl = require('./core/itpl');

    var dialog = require('./widget/dialog');

    var dialog2Str = '<div class="overlay" id="J_overlay2">\
                    <section class="modal modal_tips">\
                        <%= tip %>\
                    </section>\
                  </div>';

    var dialog2Data = {
        tip : 'tips2'
    }

    var dialog2 = itpl(dialog2Str,dialog2Data);


    $(function() {
        fastclick.attach(document.body);

        /**
         * 调用页面中的弹窗
         */
        
        $('#dialog1').on('click',function() {
            dialog({
                id : 'J_overlay1',
                type : 'fade'
            }).show();

            setTimeout(function() {
                dialog({
                    id : 'J_overlay1',
                    type : 'fade'
                }).hide();
            },600)

        })

        /**
         * push进去的弹窗
         */
        
        $('#dialog2').on('click',function() {
            dialog({
                id : 'J_overlay2',
                pushHtml : dialog2
            }).show();
        })
        
    })

})