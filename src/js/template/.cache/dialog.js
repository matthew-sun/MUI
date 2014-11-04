/*TMODJS:{"version":6,"md5":"b974325d703632890282b4eb8cfa8a00"}*/
template('dialog',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+='<button id="dialog1" class="demo_btn">lay id</button> <button id="dialog2" class="demo_btn">pushHtml</button>  <div class="overlay" id="J_overlay1"> <section class="modal modal_tips"> tips1 </section> </div>  ';
include('./public/footer');
return new String($out);
});