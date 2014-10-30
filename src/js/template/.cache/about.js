/*TMODJS:{"version":9,"md5":"cdecfb700430c9f95d61395358c79673"}*/
template('about',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';include('./public/header');
$out+=' <p id="main">I\'m about.</p> ';
include('./public/footer');
$out+=' ';
return new String($out);
});