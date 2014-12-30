var divs;
var top;
var store_view;
var owners_product;
function main(){
  divs=new Array();
  top=document.getElementById("top");
  top.className="top";

  store_view = document.createElement("div");
  store_view.id="store_view";

  var product_file_name = "http://sjf2000.github.io/product.txt";
  var httpRequest =new XMLHttpRequest();
  httpRequest.open("GET",product_file_name,false);
  httpRequest.onloadend=processProductString;
  httpRequest.send(null);
  httpRequest=null;
}
function processProductString(s){
  owners_product = new Object();
  var product_string = s.target.responseText;
  var owners_string = product_string.split("\n\n");
  var owners_count = owners_string.length;
  for (var owner = 0; owner < owners_count; ++owner) {
    var owner_string = owners_string[owner];
    var pos = owner_string.indexOf("\n");
    if (pos != -1) {
      var owner_name = owner_string.substring(0, pos);
      var products_string = owner_string.substring(pos + 1).split("\n");
      var products_count = products_string.length;
      var products = new Object();
      for (var product = 0; product < products_count; ++product) {
        var product_string = products_string[product];
        var pos = product_string.indexOf(" ");
        products[product_string.substring(0, pos)] =parseInt(product_string.substring(pos + 1));
      }
      owners_product[owner_name] = products;
    }
  }
}


function store_take_stock_num_click(e) {
  var num_e = e.target;
  var num = parseInt(num_e.text);
  var t = num;
  var p = owners_product[owner_name];
  if (p != null) {
    var n = p[product_name];
    if (n != null) {
      t = n - t;
    }
  }
  var span = product.querySelector("span");
  if (t != 0) {
    span.text = t.toString();
    span.style.color = "#fff"
    span.style.backgroundColor = "#dd524d"
    span.style.display = "inline-block"
    span.style.lineHeight = "1"
    span.style.borderRadius = "0px"
    span.style.padding = "0px 0px";
  } else {
    span.style.display = "none";
  }
  back();
}
function areas_open_click(e) {
  var n = e.target;
  var str = n.text;
  if (str != "") {
    var n2 = document.getElementById("areas");
    n2.style.display = "inline";
    var nn = document.getElementById(str);
    nn.style.display = "inline";

    var l = window.createElement("list");
    l.add(n2);
    l.add(nn);
    divs.push(l);
  }
}
