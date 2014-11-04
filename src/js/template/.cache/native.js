/*TMODJS:{"version":1,"md5":"a4a72c2654b8beb6788628b3c36b564a"}*/
template('native',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';include('./public/footer');
$out+=' ';
return new String($out);
});