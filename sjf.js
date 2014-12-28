var divs;
var top;
var store_view;
function main(){
  divs=new Object();
  top=document.getElementById("top");
  top.className="top";

  store_view = document.createElement("div");
  store_view.id="store_view";

  var product_file_name = "product.txt";
  var httpRequest =new XMLHttpRequest();
  httpRequest.open("GET",product_file_name,false);
  httpRequest.onloadend=processProductString;
  httpRequest.send(null);
  httpRequest=null;
}
function processProductString(s){
  window.alert("");
}
