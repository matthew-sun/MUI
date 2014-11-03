/**
 * @important tip
 * itpl因为一些原因，已经退出了MUI的舞台
 */

/**
 * itpl(爱模板) ———— javascirpt前端模板引擎
 * @name itpl
 * @description 提供不含js逻辑的前端模板解析，提供js预编译(经过编译的模板，输出效率将提升20倍以上)，提供直接模板方法
 * @modified 1.0.1 增加noConflict以避免命名冲突
 * @modified 1.0.2 support seajs
 * @modified 1.0.3 优化直接模板方法
 * @author matthewsun
 * @link matthew-sun@foxmail.com
 */
;(function(window){

    /**
     * itpl
     * @param  {String} 模板名
     * @param  {Srting||json} 预解析模板
     * @return {[type]} 解析字符串或输出的html
     */
    
    var itpl = function(filename,content) {
        return typeof content === 'string'
        ?   compile(content, {
                filename: filename
            })
        :   renderFile(filename, content);
    }

    itpl.VERSION = '1.0.3';

    var previousItpl = window.itpl;

    // 避免命名冲突
    itpl.noConflict = function() {
        window.itpl = previousItpl;
        return this;
    };

    var defaults = itpl.defaults = {
        openTag: '<%',    // 逻辑语法开始标签
        closeTag: '%>',   // 逻辑语法结束标签
        escape: true,     // 是否编码输出变量的 HTML 字符
        cache: true      // 是否开启缓存（依赖 options 的 filename 字段）
    };

    var cacheStore = itpl.cache = {};

    //HTML转义
    itpl._encodeHTML = function (source) {
        return String(source)
            .replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/\\/g,'&#92;')
            .replace(/"/g,'&quot;')
            .replace(/'/g,'&#39;');
    };

    //转义影响正则的字符
    itpl._encodeReg = function (source) {
        return String(source).replace(/([.*+?^=!:${}()|[\]/\\])/g,'\\$1');
    };

    /**
     * 简单模板引擎(不含js逻辑)
     * @param  {Srting} 模板
     * @param  {JSON} 数据
     */
    
    itpl.render = function(str,data){
        for(key in data){
            str = str.replace(new RegExp('{{(.*?)}}',"g"),function($0,$1) {
                var $1 = typeof(data[$1]) === 'undefined' ? '' : data[$1];
                return $1;
            });
        }
        return str;
    }

    /**
     * 输出编译HTML方法
     * @param  {String} DOM id || 模板
     * @param  {JSON} 数据
     * @return {FUNCTION} [description]
     */
    
    var renderFile = itpl.renderFile = function(str,data) {
        //检查是否有该id的元素存在，如果有元素则获取元素的innerHTML/value，否则认为字符串为模板
        var fn = (function(){
            var htmlStr = itpl.get(str,data);
            var fun = "var _template_fun_array=[];\nvar fn=(function(__data__){\nvar _template_varName='';\nfor(var name in __data__){\n_template_varName+=('var '+name+'=__data__[\"'+name+'\"];');\n};\neval(_template_varName);\n_template_fun_array.push('"+ htmlStr +"');\n_template_varName=null;\n})(_template_object);\nfn = null;\nreturn _template_fun_array.join('');\n";
            return new Function("_template_object",fun);

        })();

        //有数据则返回HTML字符串，没有数据则返回函数 支持data={}的情况
        var result = itpl._isObject(data) ? fn( data ) : fn;
        fn = null;

        return result;

    }

    //判断是否是Object类型
    itpl._isObject = function (source) {
        return 'function' === typeof source || !!(source && 'object' === typeof source);
    };

    /**
     * 返回编译后的串
     * @param  {String} DOM id || string
     * @param  {JSON} 数据
     */
    
    itpl.get = function(str,data) {

        //HTML5规定ID可以由任何不包含空格字符的字符串组成
        var element = document.getElementById(str);
        if (element) {

            //textarea或input则取value，其它情况取innerHTML
            var html = /^(textarea|input)$/i.test(element.nodeName) ? element.value : element.innerHTML;
            return compile(html,{
                filename : str
            });

        }else{

            //是模板字符串，则生成一个函数
            //如果直接传入字符串作为模板，则可能变化过多，不考虑缓存
            //如果传入是模板名字，则输出缓存
            var filename = str.length<8?str:'';
            if(filename) {
                return compile(str,{
                    filename : filename
                });
            }else {
                return compile(str);
            }
        };

    }

    /**
     * 编译
     * @param  {String} 模板
     * @param  {JSON} 配置选项
     * @return {String} 编译的串
     */
    
    var compile = itpl.compile = function(str,options) {

        // 合并默认配置
        options = options || {};
        for (var name in defaults) {
            if (options[name] === undefined) {
                options[name] = defaults[name];
            }
        }

        var filename = options.filename;
        var result = '';
        if(cacheStore[filename]) {
            result = cacheStore[filename];
        }else {
            result = itpl._analysisStr(str,options);
            if(options.cache) {
                cacheStore[filename] = result;
            }
        }
        return result;

    }

    /**
     * 编译方法
     * @param  {String} 模板
     * @param  {JSON} 配置选项
     * @return {String} 编译的串
     */
    
    itpl._analysisStr = function(str,options) {

        //取得分隔符
        var _left_ = options.openTag;
        var _right_ = options.closeTag;

        //对分隔符进行转义，支持正则中的元字符，可以是HTML注释 <!  !>
        var _left = itpl._encodeReg(_left_);
        var _right = itpl._encodeReg(_right_);

        str = String(str)
            
            //去掉分隔符中js注释
            .replace(new RegExp("("+_left+"[^"+_right+"]*)//.*\n","g"), "$1")

            //去掉注释内容  <%* 这里可以任意的注释 *%>
            //默认支持HTML注释，将HTML注释匹配掉的原因是用户有可能用 <! !>来做分割符
            .replace(new RegExp("<!--.*?-->", "g"),"")
            .replace(new RegExp(_left+"\\*.*?\\*"+_right, "g"),"")

            //把所有换行去掉  \r回车符 \t制表符 \n换行符
            .replace(new RegExp("[\\r\\t\\n]","g"), "")

            //用来处理非分隔符内部的内容中含有 斜杠 \ 单引号 ‘ ，处理办法为HTML转义
            .replace(new RegExp(_left+"(?:(?!"+_right+")[\\s\\S])*"+_right+"|((?:(?!"+_left+")[\\s\\S])+)","g"),function (item, $1) {
                var str = '';
                if($1){

                    //将 斜杠 单引 HTML转义
                    str = $1.replace(/\\/g,"&#92;").replace(/'/g,'&#39;');
                    while(/<[^<]*?&#39;[^<]*?>/g.test(str)){

                        //将标签内的单引号转义为\r  结合最后一步，替换为\'
                        str = str.replace(/(<[^<]*?)&#39;([^<]*?>)/g,'$1\r$2')
                    };
                }else{
                    str = item;
                }
                return str ;
            });


        str = str 
            //定义变量，如果没有分号，需要容错  <%var val='test'%>
            .replace(new RegExp("("+_left+"[\\s]*?var[\\s]*?.*?[\\s]*?[^;])[\\s]*?"+_right,"g"),"$1;"+_right_)

            //对变量后面的分号做容错(包括转义模式 如<%:h=value%>)  <%=value;%> 排除掉函数的情况 <%fun1();%> 排除定义变量情况  <%var val='test';%>
            .replace(new RegExp("("+_left+":?[hvu]?[\\s]*?=[\\s]*?[^;|"+_right+"]*?);[\\s]*?"+_right,"g"),"$1"+_right_)

            //按照 <% 分割为一个个数组，再用 \t 和在一起，相当于将 <% 替换为 \t
            //将模板按照<%分为一段一段的，再在每段的结尾加入 \t,即用 \t 将每个模板片段前面分隔开
            .split(_left_).join("\t");

        //支持用户配置默认是否自动转义
        if(options.escape){
            str = str

                //找到 \t=任意一个字符%> 替换为 ‘，任意字符,'
                //即替换简单变量  \t=data%> 替换为 ',data,'
                //默认HTML转义  也支持HTML转义写法<%:h=value%>  
                .replace(new RegExp("\\t=(.*?)"+_right,"g"),"',typeof($1) === 'undefined'?'':itpl._encodeHTML($1),'");
        }else{
            str = str
                
                //默认不转义HTML转义
                .replace(new RegExp("\\t=(.*?)"+_right,"g"),"',typeof($1) === 'undefined'?'':$1,'");
        };

        str = str

            //将字符串按照 \t 分成为数组，在用'); 将其合并，即替换掉结尾的 \t 为 ');
            //在if，for等语句前面加上 '); ，形成 ');if  ');for  的形式
            .split("\t").join("');")

            //将 %> 替换为_template_fun_array.push('
            //即去掉结尾符，生成函数中的push方法
            //如：if(list.length=5){%><h2>',list[4],'</h2>');}
            //会被替换为 if(list.length=5){_template_fun_array.push('<h2>',list[4],'</h2>');}
            .split(_right_).join("_template_fun_array.push('")

            //将 \r 替换为 \
            .split("\r").join("\\'");

        return str;

    }
    this.itpl = itpl;

    // RequireJS && SeaJS
    if (typeof define === 'function') {
        define(function() {
            return itpl;
        });
    }

})(window)