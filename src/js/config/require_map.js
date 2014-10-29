/**
 * 记录seajs的依赖关系，
 * 方便组件代码在重构时，api改变，可以不影响业务层
 * @author : matthewsun
 * @date : 2014/10/27
 * @link : matthew-sun@foxmail.com
 */

var map = {

    core : {
        func : ['zepto'],
        fastclick : [] ,
        itpl : [] ,
        router : ['zepto','func','itpl']
    },

    widget : {
        iscroll : [] ,
        dialog : ['zepto','func'] ,
        loader : ['zepto','func'] ,
        lazyload : ['zepto','func'] ,
        tab : ['zepto','func'] ,
        share : ['zepto','func','itpl'] ,
        swipe : []
    }
}