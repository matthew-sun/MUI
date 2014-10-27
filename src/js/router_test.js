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

    router().when('/',{
        templateUrl : 'tpl/index.html'
    }).when('/index',{
        templateUrl : 'tpl/index.html'
    }).when('/about',{
        templateUrl : 'tpl/about.html',
        controller : hello
    }).when('/list',{
        templateUrl : 'tpl/list.html'
    }).otherwise({
        templateUrl : 'tpl/404.html'
    })

    function hello() {
        alert('你好，小明！')
    }
})