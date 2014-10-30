/*TMODJS:{"version":3,"md5":"962850572f33398f3b80f9305eebb69f"}*/
template('list',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';include('./public/header');
$out+=' <p id="main">I\'m list.</p> ';
include('./public/footer');
$out+=' ';
return new String($out);
});