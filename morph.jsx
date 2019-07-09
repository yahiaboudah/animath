#include "json2.js";
#targetengine beforeMorph, afterMorph
beforeMorph = [];
afterMorph = [];
defaultMorphingTime = 0.5;

var w = new Window ("palette","Morpher");
var beforeMorph = w.add("button",undefined,"Before");
var afterMorph = w.add("button",undefined,"After");
var applyMorph = w.add("button",undefined,"Apply");
w.show();

function getSelectedShapeLayers(){
  var comp = app.project.activeItem;
  if(!comp || !(comp instanceof CompItem)){
    alert("select a composition");
    return;
  }
  if(comp.selectedLayers.length == 0){
    alert("Select some layers");
    return;
  }else{
    for(var i=1;i<comp.selectedLayers.length;i++){
      if(!(typeof comp.selectedLayers[i] == ShapeLayer)){
        alert("Only shape layers");
        return;
      }
    }
    return comp.selectedLayers;
  }
}

function getPathProp(group){
  //var indicies = [];
  var index = 0;
  for(var i=1;i<group.property("Contents").numProperties+1;i++){
    var x = group.property("Contents").property(i);
    if(x.name.indexOf("Path") != -1){
      index = i;
      break;
      //indicies[indicies.length] = i;
    }
  }
  // return indicies;
  return index;
}

function getDiff(morphed,morphedTo){
  var morphedNumProps = morphed.property("Contents").numProperties;
  var morphedToNumProps = morphedTo.property("Contents").numProperties;
  var diff = morphedToNumProps - morphedNumProps;
  return diff;
}

function getDistances(layer){
  comp = app.project.activeItem;
  distances = [];
  contents = layer.property("Contents");
  src = layer.sourceRectAtTime(comp.time,false);
  for(var i=1;i<contents.numProperties+1;i++){
    pos = contents.property(i).property("Transform").property("Position").value;
    dist = Math.sqrt(Math.pow((pos[0]-src.left),2)+Math.pow((pos[1]-src.top),2));
    distances[distances.length] = dist;
  }
  return distances;
}

function rotateArray(array,direction,i){
  arr = JSON.parse(JSON.stringify(array));
    if(direction == "RIGHT"){
      while(i){
        arr.unshift(arr.pop());
        i--;
      }
    }
    else if(direction == "LEFT"){
      while(i){
        arr.push(arr.shift());
        i--;
      }
    }
    else{
      alert("Direction is either LEFT or RIGHT");
    }
  return arr;
}

function moveFirstVertex(path,direction, num){
  pathValue = path.value;
  vert = pathValue.vertices;
  intan = pathValue.inTangents;
  outtan = pathValue.outTangents;
  isClosed = pathValue.closed;
  shape = new Shape();
  shape.vertices = rotate(vert,direction,num);
  shape.inTangents = rotate(intan,direction,num);
  shape.outTangents = rotate(outtan,direction,num);
  shape.closed = isClosed;
  return shape;
}

function alpha(layer){
  expression = "src = thisLayer.sourceRectAtTime();\n"
  +"sc = transform.scale;\n"
  +"w = sc[0]*src.width/200;\n"
  +"h = sc[1]*src.height/200;\n"
  +"pos = [toWorld([src.left,0])[0]+w,toWorld([0,src.top])[1]+h];\n"
  +"thisLayer.sampleImage(pos,[w,h]);";
  colorProp = layer.property("Effects").addProperty("Color Control");
  colorPropp = colorProp.property("Color");
  colorPropp.expression = expression;
  alphaVal = colorPropp.value;
  colorProp.remove();
  return alphaVal[3];
}

function area(layer){
  comp = app.project.activeItem;
  src = layer.sourceRectAtTime(comp.time,false);
  sc = layer.transform.scale.value;
  width = src.width * sc[0] / 100;
  height = src.height * sc[1] / 100;
  return width * height;
}

function getAreas(layer,getAlpha,getRectangleArea){
  areas = [];
  contents = layer.property("Contents");
  // make everything invisible:
  for(var i=1;i<contents.numProperties+1;i++){
    contents.property(i).enabled = false;
  }
  // make visible one at a time:
  for(var i=1;i<contents.numProperties+1;i++){
    if(i>1){
      contents.property(i).enabled = false;
    }
    contents.property(i).enabled = true;
    area = getRectangleArea(layer);
    alpha = getAlpha(layer);
    areas[areas.length] = area * alpha;
  }
  return areas;
}

function centerOfMass(distances,areas){
  if(distances.length != areas.length){
    alert("Unequal length");
    return undefined;
  }else{
    xdistance = 0;
    ydistance = 0;
    len = areas.length;
    for(var i=0;i<distances.length;i++){
      xdistance += distances[i][0]*areas[i];
      ydistance += distances[i][1]*areas[i];
    }
    xdistance /= len;
    ydistance /= len;
    return [xdistance,ydistance];
  }
}

function sortIndices(list) {
  var result = [];
  for(var i = 0; i < list.length; i++) result[i] = i;
  result = result.sort(function(u,v) { return list[u] - list[v]; });
  for(var i = 0; i < result.length; i++) result[i] += 1;
  return result;
}

function morph(bMorph,aMorph,morphedIndices,morphedToIndices,morphTime){
  // Get current comp time:
  var compTime = app.project.activeItem.time;
  // loop through all properties
  for(var j=1;j<bMorph[0].property("Contents").numProperties+1;j++){
    // Get the right groups:
    morphedIndex = morphedIndices[j-1];
    morphedToIndex = morphedToIndices[j-1];
    var group = bMorph[0].property("Contents").property(morphedIndex);
    var otherGroup = aMorph[0].property("Contents").property(morphedToIndex);
    // Get the right path prop index:
    var num = getPathProp(group);
    var otherNum = getPathProp(otherGroup);
    // Get the path props:
    var pathProp = group.property("Contents").property(num).path;
    var otherPathProp = otherGroup.property("Contents").property(otherNum).path;
    // Get pos properies:
    var thisPos = group.property("Transform").property("Position");
    var otherPos = otherGroup.property("Transform").property("Position");
    // Set the path value in that group:
    pathProp.setValueAtTime(compTime,pathProp.value);
    pathProp.setValueAtTime(compTime+morphTime,otherPathProp.value);
    // Set the pos value:
    thisPos.setValueAtTime(compTime,thisPos.value);
    thisPos.setValueAtTime(compTime+morphTime,otherPos.value);
}
}


beforeMorph.onClick = function(){
  selLayers = getSelectedShapeLayers();
  if(selLayers == null){
    return;
  }else{
    beforeMorph = selLayers;
    alert("Pre-morphing Layers Selected!");
  }
}

afterMorph.onClick = function(){
  selLayers = getSelectedShapeLayers();
  if(selLayers == null){
    return;
  }else{
    afterMorph = selLayers;
    alert("Post-morphing Layers Selected!");
  }
}

applyMorph.onClick = function(){
  var morphTime = prompt("Enter the morphing time",defaultMorphingTime);
  morphTime = eval(morphTime);
  bmoDist = getDistances(beforeMorph[0]);
  amoDist = getDistances(afterMorph[0]);
  bmoIndices = sortIndices(bmoDist);
  //alert(bmoIndices);
  amoIndices = sortIndices(amoDist);
  //alert(amoIndices);
  app.beginUndoGroup("MorphIt");
  //alert(bmoDist);
  morph(beforeMorph,afterMorph,bmoIndices,amoIndices,morphTime);
  app.endUndoGroup();
  alert("final");
}
