define(function(require, exports, module){
    var $ = require('../../zepto/zepto');

    var fastclick = require('../../core/fastclick');
    var func = require('../../core/func');
    var router = require('../../core/router');
    var template = require('../../core/template');

    var tab = require('../../widget/tab');
    var IScroll = require('../../widget/iscroll');
    var Swipe = require('../../widget/swipe');
    var dialog = require('../../widget/dialog');
    var lazyload = require('../../widget/lazyload');

    fastclick.attach(document.body);
    window.addEventListener('load',function() {
        setTimeout(scrollTo,0,0,1);
    },false);

    var demoController = func.Class({
        init : function() {
            commonFunction();
            this.initIscroll();
            this.tabNav();
        },

        initIscroll : function() {

            this.scroll = new IScroll('#wrapper');
        },

        tabNav : function() {
            tab({
               superClass : 'superNav' ,
               subClass : 'suberCon'
            })

            var $scroll = $('#J_scroll');
            var $swipe = $('#J_swipe');
            var me = this;

            $scroll.on('click',function() {
                me.scroll = new IScroll('#wrapper');
            })

            $swipe.on('click',function() {
                me.scroll.destroy();
                me.initSwipe();
            })
        },
        initSwipe : function() {
            var elem = document.getElementById('mySwipe');
            window.mySwipe = Swipe(elem, {
              // startSlide: 4,
              // auto: 3000,
              // continuous: true,
              // disableScroll: true,
              // stopPropagation: true,
              // callback: function(index, element) {},
              // transitionEnd: function(index, element) {}
            });
        }
    });

    var dialogController = func.Class({
        init : function() {
            commonFunction();
            this.initDialog();
        },
        initDialog : function() {
            var dialog2Str = '<div class="overlay" id="J_overlay2">\
                    <section class="modal modal_tips">\
                        {{tip}}\
                    </section>\
                  </div>';

            var dialog2Data = {
                tip : 'tips2'
            }

            var render = template.compile(dialog2Str);
            var dialog2 = render(dialog2Data);

            /**
             * 调用页面中的弹窗
             */
            
            $('#dialog1').on('click',function() {
                dialog({
                    id : 'J_overlay1',
                    type : 'fade'
                }).show();

                setTimeout(function() {
                    dialog({
                        id : 'J_overlay1',
                        type : 'fade'
                    }).hide();
                },600)

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

        }
    });

    var lazyloadController = func.Class({
        init : function() {
            commonFunction();
            lazyload();
        } 
    });

    var commonFunction = func.Class({
        init : function() {
            this.initFooterActiveClass();
        },

        /**
         * 初始化底部激活按钮
         */
        initFooterActiveClass : function() {
            var $footer = $('#J_demoFooter');
            var $aLink = $footer.find('a');

            if( location.hash === '#/' ) {
                $aLink.eq(0).addClass('on');
            }else {
                $aLink.each(function() {

                    if( $(this).attr('href') == location.hash ) {
                        $(this).addClass('on')
                    }   

                })
            }
        }
    });

    var demoData = {
        postList: ['Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        ] 
    }
    /**
     * 路由控制
     */
    router().when('/',{
        templateId : 'demo',
        templateData : demoData,
        controller : demoController
    }).when('/plugin',{
        templateId : 'demo',
        templateData : demoData,
        controller : demoController
    }).when('/dialog',{
        templateId : 'dialog',
        controller : dialogController
    }).when('/lazyload',{
        templateId : 'lazyload',
        controller : lazyloadController
    }).otherwise({
        templateId : '404'
    })

})