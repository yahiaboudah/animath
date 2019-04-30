#include "json2.js";
#targetengine allPoints
slidingPoints = []

NULL_LAYER_COMMENT = "thisispointcollectionnulllayer";
DEFAULT_PATH = "C:/Users/HP/Desktop/math animation'/Scripts/SlidingPoints";

var w = new Window ("palette","Point recorder");
var startSession = w.add("button",undefined,"&Ctart");
var store = w.add("button",undefined,"&Store");
var endSession = w.add("button",undefined,"&End");
store.shortcutKey = "o";
w.show();

function createNull(){
  var comp = app.project.activeItem;
  var nullLayer = comp.layers.addNull();
  nullLayer.property("Effects").addProperty("Point Control");
  nullLayer.comment = NULL_LAYER_COMMENT;
  return nullLayer;
}

function addPoint(layer,pointCollection){
  var point = layer.property("Effects").property("Point Control").property("Point");
  var lengtho = pointCollection.length;
  pointCollection[lengtho] = [];
  pointCollection[lengtho] = point.value;
}

function getNullLayer(){
  var comp = app.project.activeItem;
  for(var i=1;i<comp.layers.length;i++){
    if(comp.layer(i).comment == NULL_LAYER_COMMENT){
      return comp.layer(i);
    }
  }
}

function writeToJSON(arr,chosenName){
  if(chosenName == ""){
    chosenName = "defaultName";
  }
  var file = new File(DEFAULT_PATH+chosenName+".json");
  file.open('w');
  j = JSON.stringify(arr);
  file.write(j);
  file.close();
}

function getPoints(filepath){
  var file = openDlg(filepath);
  file.open('r');
  contents = file.read();
  file.close();
  var arr = JSON.parse(contents);
  return arr;
}


startSession.onClick = function(){
  var layer = createNull();
}

store.onClick = function(){
  var selLayer = app.project.activeItem.selectedLayers[0];
  if(selLayer.comment != NULL_LAYER_COMMENT){
    selLayer = getNullLayer();
  }
  addPoint(selLayer,slidingPoints);
}

endSession.onClick = function(){
  var p = prompt("Enter the name of the file:");
  writeToJSON(slidingPoints,p);
  alert(slidingPoints);
  alert("point array saved!");
  var a = getPoints(DEFAULT_PATH+p+'.json');
  alert(a);
}
