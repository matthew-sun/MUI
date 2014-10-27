/**
 * @author : matthewsun
 * @mail : matthew-sun@foxmail.com
 * @date : 2014/10/21
 */
define(function(require, exports, module){
    var $ = require('./zepto/zepto');
    
    var fastclick = require('./core/fastclick');

    var tab = require('./widget/tab');


    $(function() {
        
        fastclick.attach(document.body);

        tab({
            superClass : 'superNav' ,
            subClass : 'suberCon'
        })

    })



})