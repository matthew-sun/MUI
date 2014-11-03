/**
 * @author : matthewsun
 * @mail : matthew-sun@foxmail.com
 * @date : 2014/10/21
 */
define(function(require, exports, module){
    var $ = require('./zepto/zepto');
    
    var fastclick = require('./core/fastclick');
    var router = require('./core/router');

    fastclick.attach(document.body);

    var INDEX_DATA = {
        title : '首页',
        list  : [
            {
                url : 'http://www.fehouse.com' ,
                title : '前端家园'
            },
            {
                url : 'http://www.1717wan.cn' ,
                title : '1717wan'
            }
        ]
    }
    
    function hello() {
        alert('你好，小明！')
    }

    router().when('/',{
        templateId : 'index',
        templateData : INDEX_DATA,
        title : 'index'
    }).when('/index',{
        templateId : 'index',
        templateData : INDEX_DATA,
        title : 'index'
    }).when('/about',{
        templateId : 'about',
        controller : hello,
        title : 'about'
    }).when('/list',{
        templateId : 'list',
        title : 'list'
    }).otherwise({
        templateId : '404',
        title : '404'
    })

})