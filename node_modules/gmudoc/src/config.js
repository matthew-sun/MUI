/**
 * @file
 * @module UEDITOR_CONFIG
 */

/**
 * UEditor配置项集合
 * @module UEDITOR_CONFIG
 */

(function () {

    window.UEDITOR_CONFIG = {

        /**
         * @property { String } UEDITOR_HOME_URL 编辑器的根路径
         * @default 由编辑器自动计算出的根路径地址
         */
        UEDITOR_HOME_URL : URL

        /**
         * @property { String } imageUrl 图片上传的后端接口
         * @default UEditor提供的默认接口路径
         *
         * * PHP下的默认路径是: UEDITOR_HOME_URL／php/imageUp.php
         */
        ,imageUrl:URL+"php/imageUp.php"

        /**
         * @property { String } imagePath
         * @default
         */
        ,imagePath:URL + "php/"                     //图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置

    };
})();
