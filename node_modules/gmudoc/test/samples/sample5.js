/**
 * UEditor公用空间，UEditor所有的功能都挂载在该空间下
 * @module UE
 */

/**
 * 编辑器主类，包含编辑器提供的大部分公用接口
 * @file
 * @module UE
 * @class Editor
 * @since 1.2.6.1
 */

(function () {

    /**
     * UEditor的核心类，为用户提供与编辑器交互的接口。
     * @module UE
     * @class Editor
     */

    /**
     * 编辑器准备就绪后会触发该事件
     * @module UE
     * @class Editor
     * @event ready
     * @param { UE.Editor } editor 当前所监听的编辑器对象的引用
     * @example
     * ```javascript
     * editor.addListener( 'ready', function( editor ) {
     *
     *     editor.execCommand( 'focus' );
     *
     * } );
     * ```
     */


    /**
     * 每当编辑器内部选区发生改变后， 将触发该事件
     * @event selectionchange
     * @warning 该事件的触发非常频繁，不建议在该事件的处理过程中做重量级的处理
     * @param { UE.Editor } editor 当前所监听的编辑器对象的引用
     * ```javascript
     * editor.addListener( 'selectionchange', function( editor ) {
     *
     *     editor.execCommand( 'bold' );
     *
     * }
     */

    /**
     * 以默认参数构建一个编辑器实例
     * @constructor
     * @example
     * ```javascript
     * var editor = new UE.Editor();
     * editor.execCommand('blod');
     * ```
     * @see UE.Config
     */

    /**
     * 以给定的参数集合创建一个编辑器对象，对于未指定的参数，将应用默认参数。
     * @constructor
     * @param {PlainObject} setting 创建编辑器的参数
     * @example
     * ```javascript
     * var editor = new UE.Editor();
     * editor.execCommand('blod');
     * ```
     * @see UE.Config
     */
    var Editor = UE.Editor = function (options) {

    };


    Editor.prototype = {


        /**
         * @method ready
         * @param { Function } fn 编辑器ready之后所执行的回调, 如果在注册事件之前编辑器已经ready，将会
         * 立即触发该回调。
         * @see UE.Editor.event:ready
         * @example
         * ```javascript
         * editor.addListener( 'ready', function( editor ) {
         *
         *     editor.setContent('初始化完毕');
         *
         * } );
         * ```
         */
        ready: function (fn) {
            var me = this;
            if (fn) {
                me.isReady ? fn.apply(me) : me.addListener('ready', fn);
            }
        },


        /**
         * 以attributeName - attributeValue的方式设置编辑器的配置项，以覆盖编辑器的默认选项值
         * @private
         * @method setOPt
         * @warning 该方法仅供编辑器构造函数调用，其他任何方法不能调用。
         * @param { String } key 编辑器的可接受的选项名称
         * @param {*} val  该选项可接受的值
         * @example
         * ```javascript
         * editor.setOpt( 'initContent', '欢迎使用编辑器' );
         * ```
         */


        /**
         * 以key-value集合的方式设置编辑器的配置项，以覆盖编辑器的默认选项值
         * @private
         * @method setOPt
         * @warning 该方法仅供编辑器构造函数调用，其他任何方法不能调用。
         * @param { PlainObject } settings 编辑器的可接受的选项的key-value集合
         * @example
         * ```javascript
         * editor.setOpt( {
         *     'initContent': '欢迎使用编辑器'
         * } );
         * ```
         */
        setOpt: function (key, val) {
            var obj = {};
            if (utils.isString(key)) {
                obj[key] = val
            } else {
                obj = key;
            }
            utils.extend(this.options, obj, true);
        },


        /**
         * 销毁编辑器实例对象
         * @method destroy
         * @example
         * ```javascript
         * editor.destroy();
         * ```
         */
        destroy: function () {

            var me = this;
            me.fireEvent('destroy');
            var container = me.container.parentNode;
            var textarea = me.textarea;
            if (!textarea) {
                textarea = document.createElement('textarea');
                container.parentNode.insertBefore(textarea, container);
            } else {
                textarea.style.display = ''
            }

            textarea.style.width = me.iframe.offsetWidth + 'px';
            textarea.style.height = me.iframe.offsetHeight + 'px';
            textarea.value = me.getContent();
            textarea.id = me.key;
            container.innerHTML = '';
            domUtils.remove(container);
            var key = me.key;
            //trace:2004
            for (var p in me) {
                if (me.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
            UE.delEditor(key);
        },


        /**
         * 获取编辑器的内容
         * @method getContent
         * @warning 该方法获取到的是经过编辑器内置的过滤规则进行过滤后得到的内容
         * @returns { String } 编辑器的内容字符串, 如果编辑器的内容为空， 则返回空字符串
         * @example
         * ```javascript
         * var content = editor.getContent();
         * ```
         */

        /**
         * 获取编辑器的内容。 可以通过参数定义编辑器内置的判空规则
         * @method getContent
         * @param { Function } fn 自定的判空规则， 要求该方法返回一个boolean类型的值，
         *                      代表当前编辑器的内容是否空，
         *                      如果返回true， 则该方法将直接返回空字符串；如果返回false，则编辑器将返回
         *                      经过内置过滤规则处理后的内容。
         * @remind 该方法在处理包含有初始化内容的时候能起到很好的作用。
         * @warning 该方法获取到的是经过编辑器内置的过滤规则进行过滤后得到的内容
         * @returns { String } 编辑器的内容字符串
         * @example
         * ```javascript
         * // editor 是一个编辑器的实例
         * var content = editor.getContent( function ( editor ) {
         *
         *      return editor.body.innerHTML === '欢迎使用UEditor';
         *
         * } );
         * ```
         */
        getContent: function (fn,ignoreBlank,formatter) {

            var me = this,
                ignoreBlank = ignoreBlank || false,
                formatter = formatter || false;

            if (fn ? !fn() : !this.hasContents()) {
                return '';
            }
            me.fireEvent('beforegetcontent');
            var root = UE.htmlparser(me.body.innerHTML,ignoreBlank);
            me.filterOutputRule(root);
            me.fireEvent('aftergetcontent', cmd);
            return  root.toHtml(formatter);

        }
    };

})();
