/**
 * @file require_map
 * @module MUI
 */

/**
 * @class config
 */

/**
 * @method require_map
 * @desc
 * 记录seajs的依赖关系，
 * 方便组件代码在重构时，api改变，可以不影响业务层
 * @example
 * 比如：router依赖'zepto','func','template'，记录为：
 *     router : ['zepto','func','template']
 *
 * // 可能它会是长这个样子的
 *  var require_map = {
 *
 *      core : {
 *          func : ['zepto'],
 *          fastclick : [] ,
 *          itpl : [] ,
 *          router : ['zepto','func','template']
 *      },
 *
 *      widget : {
 *          iscroll : [] ,
 *          dialog : ['zepto','func'] ,
 *          loader : ['zepto','func'] ,
 *          lazyload : ['zepto','func'] ,
 *          tab : ['zepto','func'] ,
 *          share : ['zepto','func','itpl'] ,
 *          swipe : []
 *      }
 *  }
 * 
 */

var require_map = {

    core : {
        func : ['zepto'],
        fastclick : [] ,
        itpl : [] ,
        router : ['zepto','func','template']
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