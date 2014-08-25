/**
 * @author : matthewsun
 * @mail : matthew-sun@foxmail.com
 * @description : 封装一些与业务无关的底层方法
 * @description : CLASS || EVENT || HTTP || MOBILE
 * @date : 2014/08/25
 */
define(function(require, exports, module){
    var $ = require('./base/zepto');
    var fastclick = require('./base/fastclick');
    var itpl = require('./base/itpl');

    var dialog = require('./ui/dialog');

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
                id : 'J_overlay1'
            }).show();

            setTimeout(function() {
                dialog({
                    id : 'J_overlay1'
                }).hide();
            },500)

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