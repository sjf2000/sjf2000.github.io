var divs;
var top;
var store_view;
var owners_product;
var store_take_stock_view;
divs = new Array();
top = document.getElementById("top");
top.className = "top";
store_view = document.createElement("div");
store_view.id = "store_view";

var product_file_name = "product.txt";
var httpRequest = new XMLHttpRequest();
httpRequest.open("GET", product_file_name, false);
httpRequest.onloadend = processProductString;
httpRequest.send(null);
httpRequest.onloadend = null;

var store_file_name = "store.txt";
httpRequest.open("GET", store_file_name, false);
httpRequest.onloadend = processStoreString;
httpRequest.send(null);
httpRequest.onloadend = null;
var depot_file_name = "depot.txt";
httpRequest.open("GET", depot_file_name, false);
httpRequest.onloadend = processDepotString;
httpRequest.send(null);
httpRequest.onloadend = null;

store_take_stock_view = document.createElement("div");
store_take_stock_view.className = "top";
store_take_stock_view.style.flexFlow = "column";

store_take_stock_product_view =document.createElement("input");
store_take_stock_product_view.type="button";
store_take_stock_product_view.disabled = true;
store_take_stock_product_view.style.height = "3em";
store_take_stock_num_view = document.createElement("div");
store_take_stock_num_view.style.display = "flex"
store_take_stock_num_view.style.flexFlow = "column"
store_take_stock_num_view.style.flex = "1";

store_take_stock_num_view.onClick=store_take_stock_num_click;

var count = 0;
for (var i = 0; i < 6; ++i) {
	var line = document.createElement("div");
	line.style.display = "flex"
	line.style.flexFlow = "row"
	line.style.flex = "1";

	for (var j = 0; j < 5; ++j) {
		var e = document.createElement("input");
		e.type="button";
		e.text = toString(count);
		e.style.flex = "1";
		line.appendChild(e);
		++count;
	}
	store_take_stock_num_view.appendChild(line);
}
var b = document.createElement("input");
b.type="button";
b.text = "清除";
b.style.height = "6em";
b.onclick=clear;

store_take_stock_view.appendChild(store_take_stock_product_view);
store_take_stock_view.appendChild(store_take_stock_num_view);
store_take_stock_view.appendChild(b);

store_view.appendChild(store_areas_open_view);
store_view.appendChild(store_areas_view);
store_view.appendChild(store_take_stock_view);
top.appendChild(store_view);

document.getElementById("store_open").onClick=onStoreOpen;
document.getElementById("depot_open").onClick=onDepotOpen;
document.getElementById("back").onClick=onBack);

function processProductString(s) {
	owners_product = new Object();
	var product_string = s.target.responseText;
	var owners_string = product_string.split("\n\n");
	var owners_count = owners_string.length;
	for (var owner = 0; owner < owners_count; ++owner) {
		var owner_string = owners_string[owner];
		var pos = owner_string.indexOf("\n");
		if (pos != -1) {
			var owner_name = owner_string.substr(0, pos);
			var products_string = owner_string.substr(pos + 1).split("\n");
			var products_count = products_string.length;
			var products = new Object();
			for (var product = 0; product < products_count; ++product) {
				var product_string = products_string[product];
				var pos = product_string.indexOf(" ");
				products[product_string.substr(0, pos)] = parseInt(product_string.substr(pos + 1));
			}
			owners_product[owner_name] = products;
		}
	}
}

function processStoreString(s) {
  var store_string = s.target.responseText;
  store_areas_open_view = document.createElement("div");
  store_areas_open_view.id = "areas_open";
  store_areas_open_view.className = "top";
  store_areas_open_view.style.display = "flex";
  store_areas_open_view.style.flexFlow = "column";

  store_areas_view = document.createElement("div");
  store_areas_view.id = "areas";
  store_areas_view.className = "top";

  store_areas_open_view.onClick=areas_open_click;
  store_areas_view.onClick=areas_click;

  var areas_string = store_string.split('\n\n');
  var areas_count = areas_string.length;

  var areas_columns_count = areas_count ~/ 8 + 1;
  for (var i = 0; i < areas_rows_count; ++i) {
    var line_view = document.createElement("div");
    line_view.style.display = "flex"
    line_view.style.flexFlow = "row"
    line_view.style.flex = "1";
    for (var j = 0; j < areas_columns_count; ++j) {
      var cell = document.createElement("input");
      cell.type="button";
      cell.style.flex = "1";
      line_view.appendChild(cell);
    }
    store_areas_open_view.appendChild(line_view);
  }
  for (var area_no = 0; area_no < areas_count; ++area_no) {
    var area_string = areas_string[area_no];
    var pos = area_string.indexOf("\n");
    var area_name = area_string.substr(0,pos);
    {
      var row = area_no ~/ areas_columns_count;
      var column = area_no % areas_columns_count;
      var line_view = store_areas_open_view.childNodes.item(row);
      var cell = line_view.childNodes.item(column);
      cell.text = area_name;
    }
    var table_string = area_string.substr(pos + 1);

    var rows_string = table_string.split('\n');
    var rows_count = rows_string.length;

    var area_view = document.createElement("div");
    area_view.id = area_name;
    area_view.className = "top";
    area_view.style.overflow = "scroll";
    for (var row = 0; row < rows_count; ++row) {
      var row_str = rows_string[row];

      var row_e = document.createElement("div");
      row_e.style.whiteSpace = "nowrap";
      var columns_str = row_str.split(",");
      var columns_count = columns_str.length;
      for (var column = 0; column < columns_count; ++column) {
        var column_str = columns_str[column];
        var column_e = document.createElement("input");
        column_e.type="button";
        column_e.style.width = "2.4em";
        column_e.style.height = "5.2em";
        column_e.style.whiteSpace = "normal";
        column_e.style.verticalAlign = "middle";
        if (column_str == "-") {
          column_e.text = "";
          column_e.disabled = true;
        } else {
          var pos = column_str.indexOf(".");
          var product_name = column_str.substr(pos + 1);
          if (product_name == "") {
            column_e.disabled = true;
          }
          column_e.text = product_name;
          column_e.className = column_str.substr(0, pos);
        }
        column_e.appendChild(new BRElement());
        var span_e = document.createElement("span");
        column_e.appendChild(span_e);
        if (column > 0) {
          var t1 = column_e.className;
          var t2 = row_e.lastChild.className;
          if (t1 != t2) {
            column_e.style.borderLeftColor = "rgb(255,0,0)";
          }
        }
        if (row > 0) {
          var t1 = column_e.className;
          var t2 = area_view.lastChild.NodeList.item(column).className;
          if (t1 != t2) {
            column_e.style.borderTopColor = "rgb(255,0,0)";
          }
        }
        row_e.appendChild(column_e);
      }
      area_view.appendChild(row_e);
    }

    store_areas_view.appendChild(area_view);
}

function processDepotString(s) {
	window.alert("depot");
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
	var span = product.getElementsByTagName("span");
	if (t > 0) {
		span.text = toString(t);
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
	var areas_open = e.target;
	var str = areas_open.text;
	if (str != "") {
		var n2 = document.getElementById("areas");
		n2.style.display = "inline";
		var nn = document.getElementById(str);
		nn.style.display = "inline";

		var l = new Array();
		l.push(n2);
		l.push(nn);
		divs.push(l);
	}
}
void top_click(Event e) {}
void store_take_stock_num_click(Event e) {
	ButtonElement num_e = e.target as ButtonElement;
	var num = int.parse(num_e.text);
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
		span.style
			..color = "#fff"
			..backgroundColor = "#dd524d"
			..display = "inline-block"
			..lineHeight = "1"
			..borderRadius = "0px"
			..padding = "0px 0px";
	} else {
		span.style.display = "none";
	}
	back();
}
void areas_open_click(Event e) {
	ButtonElement n = e.target as ButtonElement;
	var str = n.text;
	if (str != "") {
		var n2 = querySelector("#areas") as D..ivElement;
		n2.style.display = "inline";
		var nn = querySelector("#" + str) as DivElement;
		nn.style.display = "inline";

		var l = new List < DivElement > ();
		l.add(n2);
		l.add(nn);
		divs.add(l);
	}
}

function areas_click(e) {
	var l = new Array();
	l.push(store_take_stock_view);
	divs.push(l);

	store_take_stock_view.style.display = "flex";
	var product = e.target;
	if (product.tagname = "span") {
		product = product.parentNode;
	}
	owner_name = product.className;
	product_name = product.firstChild.text;
	store_take_stock_product_view.text = product.text;
}

function onStoreOpen(e) {}

function onDepotOpen(e) {}

function onBack(e) {
	back();
}

function back() {
	if (divs.length > 0) {
		var l = divs[divs.len - 1];
		for (var e in l) {
			e.style.display = "none";
		}
		divs.pop();
	}
}

function clear(e) {
	var span = product.getElementsByTagName("span")[0];
	span.style.display = "none";
	back();
}