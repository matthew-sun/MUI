/**
 * @file func，封装了一些与业务无关的底层方法，分为了CLASS || UTIls || EVENT || HTTP || MOBILE 这几大模块
 * @import zepto.js
 * @module MUI
 */

/**
 * MUI是基于zepto的轻量级mobile UI组件库，因为1717wan移动站的业务需要而诞生。
 * MUI由[matthewsun](http://www.fehouse.com/)开发，基于开源MIT协议，支持商业和非商业用户的免费使用和任意修改，您可以在[MUI](https://github.com/matthew-sun/MUI)上快速了解此项目。
 *
 * ###Quick Start###
 * + **官网：**https://github.com/matthew-sun/MUI
 *
 *
 * @module MUI
 * @title MUI API 文档
 */

/**
 * func.js，封装了一些与业务无关的底层方法，分为了CLASS || UTIls || EVENT || HTTP || MOBILE 这几大模块。
 * @class func
 */

define(function(require, exports, module) {
    var $ = require('../zepto/zepto');

    /**
     * CLASS model
     */
    
    var func = (function() {
        
        var _func = {};
        
        /**
         * 创建Class
         * 创建类的API，统一自调用init方法
         * @method CLass
         * @grammar func.Class(superClass,subClass) || func.Class(subClass)
         * @param {Object} [superClass] 如果使用继承方法，第一个参数为父类。
         * @param {Object} [subClass] 如果使用继承方法，第二个参数为子类；如果只创建一个类，不需要继承，那么参数即为需要创建的类。
         * @example
         * var func = require('./core/func');
         *     
         * // 创建一个类
         * var newClass = func.Class({
         *     init : function() {
         *         ...
         *     },
         *     bindEvents : function() {
         *         ...
         *     }
         * });
         *     
         * // 调用这个类，使用此函数会自动new一个类，并自己调用类中的init方法
         * newClass();
         *     
         * // 调用这个类的内部方法。
         * newClass().bindEvents();
         *     
         * // 使用继承
         * var superClass = func.Class({
         *     init : function() {
         *         ...
         *     },
         *     bindEvents : function() {
         *         ...
         *     }
         * });
         * var newClass = func.Class(superClass,{
         *     init : function() {
         *         handleEvents : function() {
         *             ...
         *         }
         *     }
         * });
         */
        
        _func.Class = function() {
            var length = arguments.length;
            var option = arguments[length-1];
            option.init = option.init || function(){};

            if(length === 2){
                var superClass = arguments[0];

                var tempClass = function() {};
                tempClass.prototype = superClass.prototype;

                var subClass = function() {
                    return new subClass.prototype._init(arguments);
                }
              
                subClass.superClass = superClass.prototype;
                subClass.callSuper = function(context,method){
                    var slice = Array.prototype.slice;
                    var a = slice.call(arguments, 2);
                    var method = subClass.superClass[method];
               
                    if(method){
                        method.apply(context, a.concat(slice.call(arguments)));
                    }
                };
                subClass.prototype = new tempClass();
                subClass.prototype.constructor = subClass;
                
                $.extend(subClass.prototype, option);

                subClass.prototype._init = function(args){
                    this.init.apply(this, args);
                };
                subClass.prototype._init.prototype = subClass.prototype;
                return subClass;

            }else if(length === 1){
                var newClass = function() {
                    return new newClass.prototype._init(arguments);
                }
                newClass.prototype = option;
                newClass.prototype._init = function(arg){
                    this.init.apply(this,arg);
                };
                newClass.prototype.constructor = newClass;
                newClass.prototype._init.prototype = newClass.prototype;
                return newClass;
            }   
        }

        return _func;
    })()

    /**
     * UTIls model
     */
    
    ;(function(func) {
        
        /**
         * 获取键值
         * @method keys
         * @grammar keys(obj)
         * @param {JSON} obj JSON对象
         * @return {Array} JSON的所有键值
         * @example
         * var func = require('./core/func');
         *     
         * var json = {
         *     'name' : '小明' ,
         *     'age' : 18
         * };
         * console.log(keys(json));
         * // == >> ['name','age']
         */

        func.keys = function(obj) {
            var keys = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) keys.push(key)
            }
            return keys;

        }

        /**
         * hover hack
         * 移动端模拟手触摸时的效果
         */
        
        /**
         * 移动端模拟手触摸时的效果
         * @method bindActiveLink
         * @grammar bindActiveLink(activeClass)
         * @param {String} [activeClass] 需要绑定dom的class名字，若不填，则默认绑定J_active
         * @example
         * var func = require('./core/func');
         * // 默认绑定J_avtive
         * func.bindActiveLink();
         * // 绑定指定Class
         * func.bindActiveLink('J_whichDomIWantToBind');
         */

        func.bindActiveLink = function(activeClass) {
            var activeClass = activeClass || 'J_active';
            var $body = $('body');

            $body.on('touchstart','.'+activeClass,function() {
                $(this).addClass('hover');
            })
            $body.on('touchend','.'+activeClass,function() {
                $(this).removeClass('hover');
            })
        }

        /**
         * @method fix
         * @grammar fix($obj, options)
         * @param {Dom} $obj 绑定fix的zepto对象
         * @param {Json} options {top:0, left:0}
         * Options:
         * - ''top'' {Number}: 距离顶部的px值
         * - ''left'' {Number}: 距离左侧的px值
         * - ''bottom'' {Number}: 距离底部的px值
         * - ''right'' {Number}: 距离右侧的px值
         * @example
         * var div = $('div');
         * div.fix({top:0, left:0}); //将div固顶在左上角
         * div.fix({top:0, right:0}); //将div固顶在右上角
         * div.fix({bottom:0, left:0}); //将div固顶在左下角
         * div.fix({bottom:0, right:0}); //将div固顶在右下角
         * @desc 固顶fix方法，对不支持position:fixed的设备上将元素position设为absolute，
         * 在每次scrollstop时根据opts参数设置当前显示的位置，类似fix效果。
         * 
         */

        func.fix = function($obj, opts) {
            var me = $obj;                      //如果一个集合中的第一元素已fix，则认为这个集合的所有元素已fix，
            if(me.attr('isFixed')) return me;   //这样在操作时就可以针对集合进行操作，不必单独绑事件去操作
            me.css(opts).css('position', 'fixed').attr('isFixed', true);
            setTimeout(function() {
                var buff = $('<div style="position:fixed;top:10px;"></div>').appendTo('body'),
                    top = buff.offset(true).top,
                    checkFixed = function() {
                        if(window.pageYOffset > 0) {
                            if(buff.offset(true).top !== top) {
                                me.css('position', 'absolute');
                                doFixed();
                                $(document).on('scrollStop', doFixed);
                                $(window).on('ortchange', doFixed);
                            }
                            $(document).off('scrollStop', checkFixed);
                            buff.remove();
                        }
                    },
                    doFixed = function() {
                        me.css({
                            top: window.pageYOffset + (opts.bottom !== undefined ? window.innerHeight - me.height() - opts.bottom : (opts.top ||0)),
                            left: opts.right !== undefined ? document.body.offsetWidth - me.width() - opts.right : (opts.left || 0)
                        });
                        opts.width == '100%' && me.css('width', document.body.offsetWidth);
                    };
                $(document).on('scrollStop', checkFixed);
            }, 300);
        }
        
    })(func)

    /**
     * EVENT model
     */
    
    ;(function(func) {

        var _cache = {};
        
        /**
         * @method fire
         * 广播事件
         * + 目标: 为了尽可能的减少模块之间业务逻辑的耦合度, 而开发了这个eventbus, 主要用于业务逻辑的事件传递
         * + 使用规范: 每个js模块尽可能通过事件去通信, 减少模块之间的直接调用和依赖(耦合)
         * + fire -> 事件派发
         * @param  {[type]} type 事件类型
         * @param  {[type]} data 回调数据
         * @example
         * var func = require('./core/func');
         * // 派发自定义事件
         * func.fire('customEvent');
         * func.fire('customEvent', data1, data2, ...);
         */
        
        func.fire = function(type, data) {
            var listeners = _cache[type],
                len = 0;
            if (typeof listeners !== 'undefined') {
                var args = [].slice.call(arguments, 0);
                args = args.length > 2 ? args.splice(2, args.length - 1) : [];
                args = [data].concat(args);

                len = listeners.length;
                for (var i = 0; i < len; i++) {
                    var listener = listeners[i];
                    if (listener && listener.callback) {
                        args = args.concat(listener.args);
                        listener.callback.apply(listener.scope, args);
                    }
                }
            }
            return this;
        }

        /**
         * @method on
         * on -> 订阅广播事件
         * @param  {[type]} type 事件类型，支持,分隔符
         * @param  {Function} callback 回调函数
         * @param  {[type]}   scope    回调函数上下文
         * @return {[type]}            this
         * @example
         * var func = require('./core/func');
         * // 注册自定义事件
         * func.on('customEvent', function() {
         *     callback();
         * },scope);
         */
        
        func.on = function(types, callback, scope) {
            types = types || [];
            var args = [].slice.call(arguments);

            if (typeof types === 'string') { 
                types = types.split(',');
            }
            var len = types.length;
            if (len === 0) {
                return this;
            }
            args = args.length > 3 ? args.splice(3, args.length - 1) : [];
            for (var i = 0; i < len; i++) {
                var type = types[i];
                _cache[type] = _cache[type] || [];
                _cache[type].push({
                    callback: callback,
                    scope: scope,
                    args: args
                });
            }
            return this;
        }
           
        /**
         * @method un
         * un -> 退订广播事件
         * @param  {[type]}   type     事件类型
         * @param  {Function} callback 假如传入则移出传入的监控事件，否则移出全部
         * @param  {[type]}   scope    回调函数上下文
         * @return {[type]}            this
         * @example
         * var func = require('./core/func');
         * // 退订自定义事件
         * func.un('customEvent');
         */
        
        func.un = function(type, callback, scope) {
            var listeners = _cache[type];
            if (!listeners) {
                return this;
            }
            if (callback) {
                var len = listeners.length,
                    tmp = [];

                for (var i = 0; i < len; i++) {
                    var listener = listeners[i];
                    if (listener.callback == callback && listener.scope == scope) {} else {
                        tmp.push(listener);
                    }
                }
                listeners = tmp;
            } else {
                listeners.length = 0;
            }
            return this;
        }
           
        /**
         * @method removeAll
         * removeAll -> 退订所有广播事件
         * @example
         * var func = require('./core/func');
         * // 退订所有广播事件
         * func.removeAll();
         */

        func.removeAll = function() {
            _cache = {};
            return this;
        }

    })(func)

    /**
     * HTTP model
     */
    
    ;(function(func) {

        /**
         * @method loader
         * @desc 对jsonp的简单封装
         * @param  {[type]} opts jsonp的配置项
         * @example
         * var func = require('./core/func');
         * func.loader({
         *     url : ? ,
         *     success : ?
         * })
         */
        
        func.loader = function(opts){
            opts = $.extend({
                dataType : "jsonp",
                jsonp : "cb",
                cache:false,
                timeout : 10000,

                success : function(){},
                error : function(jqXHR, textStatus, errorThrown){ console.log(textStatus)},
                complete : function(){}
            }, opts);
            
            $.ajax(opts);
        }
        
        /**
         * @method getCookie
         * @param {String} name cookie的名字
         * @return {String} cookie值
         * @example
         * var func = require('./core/func');
         * func.getCookie('username');
         */
        
        func.getCookie = function(name) {
            var arr = document.cookie.split('; '),
                i = 0,
                len = arr.length ;

            for(;i<len;i++){
                var arr2 = arr[i].split('=');
                if(arr2[0] == name) {
                    return arr2[1];
                }
            }
        
            return '';
        }

        /**
         * @method setCooKie
         * @param {String} name  cookie名字
         * @param {[type]} value cookie值
         * @param {Number} iDay  过期时间，单位：天
         * @example
         * var func = require('./core/func');
         * func.setCookie('username', 'Xiao Ming', 7);
         */

        func.setCookie = function(name, value, iDay) {
            if(iDay!==false){

                var exp = new Date(); 
                exp.setTime(exp.getTime() + iDay*24*60*60*1000);
                document.cookie=name+'='+value+';expires='+exp.toGMTString()+';path=/';

            }else{
                document.cookie=name+'='+value;
            }
        }

        /**
         * @method removeCookie
         * @param {String} name Cookie名
         * @example
         * var func = require('./core/func');
         * func.removeCookie('username');
         */
        
        func.removeCookie = function (name) {
            func.setCookie(name, '', -1);
        }
    })(func)

    /**
     * MOBILE model
     */
    
    ;(function(func) {
        
        /**
         * @method Device
         * @desc 判断浏览器版本
         * @return {Json} 返回浏览器的版本信息和系统的版本信息
         * @example
         * var func = require('./core/func');
         * // 返回ios系统
         * func.Device().os.ios 
         * // 返回uc
         * func.Device().os.uc
         * // 返回qq
         * func.Device().os.qq
         * // 返回baidu
         * func.Device().browser.baidu
         */
        
        func.Device = function() {
            var ua = navigator.userAgent;
            var os = this.os = {},browser = this.browser = {},

                webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
                android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
                osx = !!ua.match(/\(Macintosh\; Intel /),
                ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
                ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
                iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
                webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
                touchpad = webos && ua.match(/TouchPad/),
                kindle = ua.match(/Kindle\/([\d.]+)/),
                silk = ua.match(/Silk\/([\d._]+)/),
                blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
                bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
                rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
                playbook = ua.match(/PlayBook/),
                baidu = ua.match( /baiduboxapp\/[^\/]+\/([\d.]+)_/ )
                        || ua.match( /baiduboxapp\/([\d.]+)/ )
                        || ua.match( /BaiduHD\/([\d.]+)/ )
                        || ua.match( /FlyFlow\/([\d.]+)/ )
                        || ua.match( /baidubrowser\/([\d.]+)/ ),
                qq = ua.match( /MQQBrowser\/([\d.]+)/ ) || ua.match( /QQ\/([\d.]+)/ ),
                uc = ua.match(/UCBrowser\/([\w.\s]+)/),
                chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
                firefox = ua.match(/Firefox\/([\d.]+)/),
                ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
                webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
                safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
                orientation = Math.abs(window.orientation);

            if (browser.webkit = !!webkit) browser.version = webkit[1]

            if (android) os.android = true, os.version = android[2]
            if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
            if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
            if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
            if (webos) os.webos = true, os.version = webos[2]
            if (touchpad) os.touchpad = true
            if (blackberry) os.blackberry = true, os.version = blackberry[2]
            if (bb10) os.bb10 = true, os.version = bb10[2]
            if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
            if (playbook) browser.playbook = true
            if (baidu) browser.baidu = true,browser.version = baidu[1]
            if (qq) os.qq = true, os.ucversion = qq[1]
            if (uc) os.uc = true, os.ucversion = uc[1]
            if (kindle) os.kindle = true, os.version = kindle[1]
            if (silk) browser.silk = true, browser.version = silk[1]
            if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
            if (orientation !== 90) os.protrait = true
            if (orientation === 90) os.landscape = true

            if (chrome) browser.chrome = true, browser.version = chrome[1]
            if (firefox) browser.firefox = true, browser.version = firefox[1]
            if (ie) browser.ie = true, browser.version = ie[1]
            if (safari && (osx || os.ios)) {browser.safari = true; if (osx) browser.version = safari[1]}
            if (webview) browser.webview = true

            os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
            (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
            os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
            (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
            (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
            return {
                browser: browser,
                os: os
            };
        }

    })(func)

    return func;
})