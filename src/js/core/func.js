/**
 * @author : matthewsun
 * @mail : matthew-sun@foxmail.com
 * @description : 封装一些与业务无关的底层方法
 * @description : CLASS || UTIls || EVENT || HTTP || MOBILE 
 * @date : 2014/08/25
 */
define(function(require, exports, module){
    var $ = require('../zepto/zepto');

    /**
     * CLASS model
     * @return {[type]} [description]
     */
    
    var func = (function() {
        
        var _func = {};

        /**
         * 创建Class
         * 范式：Class(superClass,subClass) || Class(subClass)
         * 创建类的API，统一自调用init方法
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
         * 
         * @param  {[type]} obj [description]
         * @return {[Array]}     [description]
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

        func.bindActiveLink = function() {
            var $body = $('body');

            $body.on('touchstart','.J_active',function() {
                $(this).addClass('hover');
            })
            $body.on('touchend','.J_active',function() {
                $(this).removeClass('hover');
            })
        }
        
    })(func)

    /**
     * EVENT model
     */
    
    ;(function(func) {

        var _cache = {};

        /**
         * 广播事件
         * 目标: 为了尽可能的减少模块之间业务逻辑的耦合度, 而开发了这个eventbus, 主要用于业务逻辑的事件传递
         * 使用规范: 每个js模块尽可能通过事件去通信, 减少模块之间的直接调用和依赖(耦合)
         */
        
        /**
         * 派发
         * @param  {[type]} type 事件类型
         * @param  {[type]} data 回调数据
         * @return {[type]}      [description]
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
         * 订阅广播事件
         * @param  {[type]}   types     事件类型，支持,分隔符
         * @param  {Function} callback 回调函数
         * @param  {[type]}   scope    回调函数上下文
         * @return {[type]}            this
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
         * 退订
         * @param  {[type]}   type     [description]
         * @param  {Function} callback 假如传入则移出传入的监控事件，否则移出全部
         * @return {[type]}            [description]
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
         * loader
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
         * 获取cookie
         * @param  {[type]} name   [cookie名]
         * @return {[type]} String [cookie值]
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
         * 设置cookie值
         * @param {[type]} name  [cookie名字]
         * @param {[type]} value [cookie值]
         * @param {[type]} iDay  [过期时间，单位：天]
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
         * 移除Cookie
         * @param  {[type]} name [Cookie名]
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
         * 判断浏览器版本
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