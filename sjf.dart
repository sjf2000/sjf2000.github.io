import 'dart:html';

const areas_rows_count=8;
Storage local_storage;
String store_string;
String depot_string;
String product_string;
String owner_name;
String product_name;
DivElement top;
DivElement store_view;
ButtonElement product;
DivElement store_take_stock_view;
ButtonElement store_take_stock_product_view;
DivElement store_take_stock_num_view;

DivElement store_areas_open_view;
DivElement store_areas_view;

List<List<DivElement>> divs;
List<String> divs_display;
Map<String,Map<String,int>> owners_product;

void main() {
  divs=new List<List<DivElement>>();
  top = querySelector("#top");
  top.className="top";
  top.style.display="inline";
  
  store_view = new DivElement();
  store_view.id = "store_view";
  
  var product_file_name="product.txt";
  
  var httpRequest=new HttpRequest();
  httpRequest..open("GET", product_file_name,async:false);
  var d=httpRequest.onLoadEnd.listen((e)=>processProductString(httpRequest));
  httpRequest.send("");
  d.cancel();
  
  var store_file_name="store.txt";
//  HttpRequest.getString(store_file_name)
//  .then(processStoreString).catchError(processNullStoreString);
  httpRequest..open("GET", store_file_name,async:false);
  d=httpRequest.onLoadEnd.listen((e)=>processStoreString(httpRequest));
  httpRequest.send("");
  d.cancel();

  store_take_stock_view = new DivElement();
  store_take_stock_view.className="top";
  store_take_stock_view.style
      ..flexFlow = "column";

  store_take_stock_product_view = new ButtonElement();
  store_take_stock_product_view.disabled = true;
  store_take_stock_product_view.style.height="3em";
  store_take_stock_num_view = new DivElement();
  store_take_stock_num_view.style
      ..display = "flex"
      ..flexFlow = "column"
      ..flex = "1";

  store_take_stock_num_view.onClick.listen(store_take_stock_num_click);
  var count = 0;
  for (var i = 0; i < 6; ++i) {
    var line = new DivElement();
    line.style
        ..display = "flex"
        ..flexFlow = "row"
        ..flex = "1";

    for (var j = 0; j < 5; ++j) {
      var e = new ButtonElement();
      e.text = count.toString();
      e.style..flex = "1";
      line.nodes.add(e);
      ++count;
    }
    store_take_stock_num_view.nodes.add(line);
  }
  var b=new ButtonElement();
  b.text="清除";
  b.style.height="6em";
  b.onClick.listen(clear);

  store_take_stock_view.nodes.add(store_take_stock_product_view);
  store_take_stock_view.nodes.add(store_take_stock_num_view);
  store_take_stock_view.nodes.add(b);
  
  store_view.nodes.add(store_areas_open_view);
  store_view.nodes.add(store_areas_view); 
  store_view.nodes.add(store_take_stock_view);
  top.nodes.add(store_view);

  window.onBeforeUnload.listen(before_unload);
  window.onUnload.listen(unload);
  querySelector("#store_open").onClick.listen(onStoreOpen);
  querySelector("#depot_open").onClick.listen(onDepotOpen);
  querySelector("#back").onClick.listen(onBack);
}

void processStoreString(HttpRequest httpRequest){
  var store_string=httpRequest.responseText;
  store_areas_open_view=new DivElement();
  store_areas_open_view..id="areas_open"
      ..className="top";
  store_areas_open_view.style..display="flex"
      ..flexFlow="column";
  
  store_areas_view=new DivElement();
  store_areas_view.id="areas";
  store_areas_view.className="top";

  store_areas_open_view.onClick.listen(areas_open_click);
  store_areas_view.onClick.listen(areas_click);
  
  var areas_string=store_string.split('\r\n\r\n');
  var areas_count=areas_string.length;

  var areas_columns_count=areas_count~/8+1;
  for(var i=0;i<areas_rows_count;++i){
    var line_view=new DivElement();
    line_view.style..display="flex"
        ..flexFlow="row"
        ..flex="1";
    for(var j=0;j<areas_columns_count;++j){
      var cell=new ButtonElement();
      cell.style.flex="1";
      line_view.nodes.add(cell);
    }
    store_areas_open_view.nodes.add(line_view);
  }
  
  for (var area_no=0 ;area_no< areas_count;++area_no) {
    var area_string=areas_string.elementAt(area_no);
    
    var pos=area_string.indexOf("\r\n");
    var area_name = area_string.substring(0,pos);
    {
      var row=area_no~/areas_columns_count;
      var column=area_no%areas_columns_count;
      var line_view=store_areas_open_view.nodes.elementAt(row) as DivElement;
      var cell=line_view.nodes.elementAt(column) as ButtonElement;
      cell.text=area_name;
    }
    var table_string=area_string.substring(pos+2);
    
    var rows_string = table_string.split('\r\n');
    var rows_count = rows_string.length;
    
    var area_view =new DivElement();
    area_view.id=area_name;
    area_view.className="top";
    area_view.style
        ..overflow="scroll";
    for (var row = 0; row < rows_count; ++row) {
      var row_str = rows_string[row];
      
      var row_e = new DivElement();
      row_e.style..whiteSpace = "nowrap";
      var columns_str=row_str.split(",");
      var columns_count=columns_str.length;
      for (var column=0;column<columns_count;++column) {
        var column_str=columns_str.elementAt(column);
        var column_e = new ButtonElement();
        column_e.style
            ..width = "2.4em"
            ..height = "5.2em"
            ..whiteSpace = "normal"
            ..verticalAlign = "middle";
        if (column_str == "-") {
          column_e.text = "";
          column_e.disabled = true;
        } else {
          var pos = column_str.indexOf(".");
          var product_name=column_str.substring(pos+1);
          if(product_name==""){
            column_e.disabled = true;
          }
          column_e.text = product_name;
          column_e.className=column_str.substring(0, pos);
        }
        column_e.nodes.add(new BRElement());
        SpanElement span_e = new SpanElement();
        column_e.nodes.add(span_e);
        if(column>0){
          var t1=column_e.className;
          var t2=row_e.nodes.last.className;
          if(t1!=t2){
            column_e.style.borderLeftColor="rgb(255,0,0)";
          }
        }
        if(row>0){
          var t1=column_e.className;
          var t2=area_view.nodes.last.nodes.elementAt(column).className;
          if(t1!=t2){
            column_e.style.borderTopColor="rgb(255,0,0)";
          }
        }
        row_e.nodes.add(column_e);
      }
      area_view.nodes.add(row_e);
    }
    
    store_areas_view.nodes.add(area_view);
  }
}
void processNullStoreString(Error error){
  var i=0;
}
void processProductString(HttpRequest httpRequest){
  owners_product=new Map<String,Map<String,int>>();
  product_string=httpRequest.responseText;
  var owners_string=product_string.split("\r\n\r\n");
  var owners_count=owners_string.length;
  for(var owner=0;owner<owners_count;++owner){
    var owner_string=owners_string[owner];
    var pos=owner_string.indexOf("\r\n");
    if(pos!=-1){
      var owner_name = owner_string.substring(0,pos);
      var products_string=owner_string.substring(pos+2).split("\r\n");
      var products_count=products_string.length;
      var products =new Map<String,int>();
      for(var product=0;product<products_count;++product){
        var product_string=products_string[product];
        var pos=product_string.indexOf(" ");
        products[product_string.substring(0,pos)]=
            int.parse(product_string.substring(pos+1));
      }
      owners_product[owner_name]=products;
    }
  }
}
void processNullProductString(Error error){
  var i=0;
}

String before_unload(Event e) {
  return "退出？";
}
void unload(Event e) {
//  var areas_count=store_areas_view.nodes.length;
//  var areas_columns_count=areas_count~/areas_rows_count+1;
//  store_string="";
//  for(var area_no=0;area_no<areas_count;++area_no){
//    var area=store_areas_view.nodes[area_no];
//    if(area_no!=0){
//      store_string+="\n\n";
//    }
//    {
//      var row=area_no~/areas_columns_count;
//      var column=area_no%areas_columns_count;
//      var line_view=store_areas_open_view.nodes.elementAt(row) as DivElement;
//      var cell=line_view.nodes.elementAt(column) as ButtonElement;
//      cell.text=area_name;
//    }
//    store_string+=store_areas_open_view.nodes[i].
//    var rows_count=area.nodes.length;
//    for(var j=0;j<rows_count;++j){
//      store_string+="\n";
//      var row=area.nodes[j];
//      var columns_count=row.nodes.length;
//      for(var k=0;k<columns_count;++k){
//        if(k!=0){
//          store_string+=",";
//        }
//        var text=row.nodes[k].firstChild.text;
//        if(text==""){
//          store_string+="-";
//        }else{
//          store_string+=text;
//        }
//      }
//    }
//  }
//  local_storage["商店"]=store_string;
}
void top_click(Event e) {
}
void store_take_stock_num_click(Event e) {
  ButtonElement num_e = e.target as ButtonElement;
  var num = int.parse(num_e.text);
  var t=num;
  var p=owners_product[owner_name];
  if(p!=null){
    var n=p[product_name];
    if(n!=null){
      t=n-t;
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
void areas_open_click(Event e){
  ButtonElement n = e.target as ButtonElement;
  var str=n.text;
  if(str!=""){
    var n2=querySelector("#areas") as DivElement;
    n2.style.display="inline";
    var nn=querySelector("#"+str) as DivElement;
    nn.style.display="inline";
    
    var l=new List<DivElement>();
    l.add(n2);
    l.add(nn);
    divs.add(l); 
  }
}
void areas_click(Event e) {
  var l=new List<DivElement>();
  l.add(store_take_stock_view);
  divs.add(l);
  
  store_take_stock_view.style.display = "flex";
  if (e.target is ButtonElement) {
    product = e.target as ButtonElement;
  } else if (e.target is SpanElement) {
    var elem = e.target as SpanElement;
    product = elem.parent as ButtonElement;
  }
  owner_name=product.className;
  product_name=product.nodes.first.text;
  store_take_stock_product_view..text = product.text;
}
void onStoreOpen(Event e) {
}
void onDepotOpen(Event e) {
}

void onBack(Event e){
  back();
}
void back(){
  if(divs.length>0){
    var l=divs.last;
    for(var e in l){
      e.style.display="none";
    }
    divs.removeLast();
  }
}
void clear(Event e){
  var span = product.querySelector("span");
  span.style.display = "none";
  back();
}