/*TMODJS:{"version":3,"md5":"5ad0b7526953f3f15f2787400907e236"}*/
template('404',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';include('./public/header');
$out+=' <p id="main">I\'m 404.</p> ';
include('./public/footer');
$out+=' ';
return new String($out);
});