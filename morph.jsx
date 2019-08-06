#include "json2.js";
#targetengine beforeMorph, afterMorph
beforeMorph = [];
afterMorph = [];
defaultMorphingTime = 0.5;

// WIN
var win = new Window("palette");
    win.text = "Morpher";
    win.orientation = "column";
    win.alignChildren = ["center","top"];
    win.spacing = 10;
    win.margins = 16;

// MORPHERTABBEDPANEL
// ==================
var morpherTabbedPanel = win.add("tabbedpanel");
    morpherTabbedPanel.alignChildren = "fill";
    morpherTabbedPanel.preferredSize.width = 219.391;
    morpherTabbedPanel.margins = 0;
    morpherTabbedPanel.alignment = ["fill","top"];

// PREMORPHTAB
// ===========
var premorphTab = morpherTabbedPanel.add("tab");
    premorphTab.text = "Pre";
    premorphTab.orientation = "column";
    premorphTab.alignChildren = ["left","top"];
    premorphTab.spacing = 10;
    premorphTab.margins = 10;

var premorphTabGetSelectedButton = premorphTab.add("button");
    premorphTabGetSelectedButton.text = "Get selected";
    premorphTabGetSelectedButton.preferredSize.width = 131;
    premorphTabGetSelectedButton.justify = "center";
    premorphTabGetSelectedButton.alignment = ["center","top"];

var premorphTabSelectedLayerName = premorphTab.add("statictext");
    premorphTabSelectedLayerName.text = "selected layers' names.";
    premorphTabSelectedLayerName.alignment = ["fill","top"];

var premorphTabDivider = premorphTab.add("panel");
    premorphTabDivider.alignment = "fill";

// PREMORPHTABOPTIONSGROUP
// =======================
var premorphTabOptionsGroup = premorphTab.add("group");
    premorphTabOptionsGroup.orientation = "row";
    premorphTabOptionsGroup.alignChildren = ["left","center"];
    premorphTabOptionsGroup.spacing = 10;
    premorphTabOptionsGroup.margins = 0;
    premorphTabOptionsGroup.alignment = ["center","top"];

var premorphTabDefaultRadioButton = premorphTabOptionsGroup.add("radiobutton");
    premorphTabDefaultRadioButton.text = "Default";

var premorphTabCustomRadioButton = premorphTabOptionsGroup.add("radiobutton");
    premorphTabCustomRadioButton.text = "Custom";
    premorphTabCustomRadioButton.value = true;

// PREMORPHTABSORTINGDIRECTIONPANEL
// ================================
var premorphTabSortingDirectionPanel = premorphTab.add("panel");
    premorphTabSortingDirectionPanel.text = "Sorting Direction";
    premorphTabSortingDirectionPanel.orientation = "column";
    premorphTabSortingDirectionPanel.alignChildren = ["left","top"];
    premorphTabSortingDirectionPanel.spacing = 10;
    premorphTabSortingDirectionPanel.margins = [10,15,10,10];
    premorphTabSortingDirectionPanel.alignment = ["fill","top"];

var premorphTabSortingDirectionPanelSortingList_array = ["topleft","leftright","rightleft","topdown","bottomup","Closest To"];
var premorphTabSortingDirectionPanelSortingList = premorphTabSortingDirectionPanel.add("dropdownlist", undefined, premorphTabSortingDirectionPanelSortingList_array);
    premorphTabSortingDirectionPanelSortingList.selection = 0;
    premorphTabSortingDirectionPanelSortingList.text = "Sorting";
    premorphTabSortingDirectionPanelSortingList.alignment = ["fill","top"];

var premorphTabSortingDirectionPanelClosestList_array = ["layer 1","layer2","layer3"];
var premorphTabSortingDirectionPanelClosestList = premorphTabSortingDirectionPanel.add("dropdownlist", undefined, premorphTabSortingDirectionPanelClosestList_array);
    premorphTabSortingDirectionPanelClosestList.selection = 1;
    premorphTabSortingDirectionPanelClosestList.text = "Closest";

// PREMORPHTABFIRSTVERTEXPANEL
// ===========================
var premorphTabFirstVertexPanel = premorphTab.add("panel");
    premorphTabFirstVertexPanel.text = "First Vertex";
    premorphTabFirstVertexPanel.orientation = "column";
    premorphTabFirstVertexPanel.alignChildren = ["left","top"];
    premorphTabFirstVertexPanel.spacing = 11;
    premorphTabFirstVertexPanel.margins = [10,15,10,10];
    premorphTabFirstVertexPanel.alignment = ["fill","top"];

var premorphTabFirstVertexPanelFirstVertexList_array = ["topleft","left","right","bottom","up","random","Closest To"];
var premorphTabFirstVertexPanelFirstVertexList = premorphTabFirstVertexPanel.add("dropdownlist", undefined, premorphTabFirstVertexPanelFirstVertexList_array);
    premorphTabFirstVertexPanelFirstVertexList.selection = 0;
    premorphTabFirstVertexPanelFirstVertexList.text = "fVertex";
    premorphTabFirstVertexPanelFirstVertexList.alignment = ["fill","top"];

var premorphTabFirstVertexPanelClosestList_array = ["layer 1","layer2","layer3"];
var premorphTabFirstVertexPanelClosestList = premorphTabFirstVertexPanel.add("dropdownlist", undefined, premorphTabFirstVertexPanelClosestList_array);
    premorphTabFirstVertexPanelClosestList.selection = 0;
    premorphTabFirstVertexPanelClosestList.text = "Closest";

// POSTMORPHTAB
// ============
var postmorphTab = morpherTabbedPanel.add("tab");
    postmorphTab.text = "Post";
    postmorphTab.orientation = "column";
    postmorphTab.alignChildren = ["left","top"];
    postmorphTab.spacing = 10;
    postmorphTab.margins = 10;

var postmorphTabGetSelectedButton = postmorphTab.add("button");
    postmorphTabGetSelectedButton.text = "Get selected";
    postmorphTabGetSelectedButton.preferredSize.width = 131;
    postmorphTabGetSelectedButton.justify = "center";
    postmorphTabGetSelectedButton.alignment = ["center","top"];

var postmorphTabSelectedLayerName = postmorphTab.add("statictext");
    postmorphTabSelectedLayerName.text = "selected layers' names.";
    postmorphTabSelectedLayerName.alignment = ["fill","top"];

var postmorphTabDivider = postmorphTab.add("panel");
    postmorphTabDivider.alignment = "fill";

// POSTMORPHTABOPTIONSGROUP
// ========================
var postmorphTabOptionsGroup = postmorphTab.add("group");
    postmorphTabOptionsGroup.orientation = "row";
    postmorphTabOptionsGroup.alignChildren = ["left","center"];
    postmorphTabOptionsGroup.spacing = 10;
    postmorphTabOptionsGroup.margins = 0;
    postmorphTabOptionsGroup.alignment = ["center","top"];

var postmorphTabDefaultRadioButton = postmorphTabOptionsGroup.add("radiobutton");
    postmorphTabDefaultRadioButton.text = "Default";

var postmorphTabCustomRadioButton = postmorphTabOptionsGroup.add("radiobutton");
    postmorphTabCustomRadioButton.text = "Custom";
    postmorphTabCustomRadioButton.value = true;

// POSTMORPHTABSORTINGDIRECTIONPANEL
// =================================
var postmorphTabSortingDirectionPanel = postmorphTab.add("panel");
    postmorphTabSortingDirectionPanel.text = "Sorting Direction";
    postmorphTabSortingDirectionPanel.orientation = "column";
    postmorphTabSortingDirectionPanel.alignChildren = ["left","top"];
    postmorphTabSortingDirectionPanel.spacing = 10;
    postmorphTabSortingDirectionPanel.margins = [10,15,10,10];
    postmorphTabSortingDirectionPanel.alignment = ["fill","top"];

var postmorphTabSortingDirectionPanelSortingList_array = ["topleft","leftright","rightleft","topdown","bottomup","Closest To"];
var postmorphTabSortingDirectionPanelSortingList = postmorphTabSortingDirectionPanel.add("dropdownlist", undefined, postmorphTabSortingDirectionPanelSortingList_array);
    postmorphTabSortingDirectionPanelSortingList.selection = 0;
    postmorphTabSortingDirectionPanelSortingList.text = "Sorting";
    postmorphTabSortingDirectionPanelSortingList.alignment = ["fill","top"];

var postmorphTabSortingDirectionPanelClosestList_array = ["layer 1","layer2","layer3"];
var postmorphTabSortingDirectionPanelClosestList = postmorphTabSortingDirectionPanel.add("dropdownlist", undefined, postmorphTabSortingDirectionPanelClosestList_array);
    postmorphTabSortingDirectionPanelClosestList.selection = 1;
    postmorphTabSortingDirectionPanelClosestList.text = "Closest";

// POSTMORPHTABFIRSTVERTEXPANEL
// ============================
var postmorphTabFirstVertexPanel = postmorphTab.add("panel");
    postmorphTabFirstVertexPanel.text = "First Vertex";
    postmorphTabFirstVertexPanel.orientation = "column";
    postmorphTabFirstVertexPanel.alignChildren = ["left","top"];
    postmorphTabFirstVertexPanel.spacing = 11;
    postmorphTabFirstVertexPanel.margins = [10,15,10,10];
    postmorphTabFirstVertexPanel.alignment = ["fill","top"];

var postmorphTabFirstVertexPanelFirstVertexList_array = ["topleft","left","right","bottom","up","random","Closest To"];
var postmorphTabFirstVertexPanelFirstVertexList = postmorphTabFirstVertexPanel.add("dropdownlist", undefined, postmorphTabFirstVertexPanelFirstVertexList_array);
    postmorphTabFirstVertexPanelFirstVertexList.selection = 0;
    postmorphTabFirstVertexPanelFirstVertexList.text = "fVertex";
    postmorphTabFirstVertexPanelFirstVertexList.alignment = ["fill","top"];

var postmorphTabFirstVertexPanelClosestList_array = ["layer 1","layer2","layer3"];
var postmorphTabFirstVertexPanelClosestList = postmorphTabFirstVertexPanel.add("dropdownlist", undefined, postmorphTabFirstVertexPanelClosestList_array);
    postmorphTabFirstVertexPanelClosestList.selection = 0;
    postmorphTabFirstVertexPanelClosestList.text = "Closest";

// SETTINGSTAB
// ===========
var settingsTab = morpherTabbedPanel.add("tab");
    settingsTab.text = "Settings";
    settingsTab.orientation = "column";
    settingsTab.alignChildren = ["left","top"];
    settingsTab.spacing = 10;
    settingsTab.margins = 10;

// MORPHERTABBEDPANEL
// ==================
morpherTabbedPanel.selection = postmorphTab;

// SETTINGSTABOPTIONSGROUP
// =======================
var settingsTabOptionsGroup = settingsTab.add("group");
    settingsTabOptionsGroup.orientation = "row";
    settingsTabOptionsGroup.alignChildren = ["left","center"];
    settingsTabOptionsGroup.spacing = 10;
    settingsTabOptionsGroup.margins = 0;
    settingsTabOptionsGroup.alignment = ["center","top"];

var settingsTabDefaultRadioButton = settingsTabOptionsGroup.add("radiobutton");
    settingsTabDefaultRadioButton.text = "Default";
    settingsTabDefaultRadioButton.value = true;

var settingsTabCustomRadioButton = settingsTabOptionsGroup.add("radiobutton");
    settingsTabCustomRadioButton.text = "Custom";

// SETTINGSTABDUPLICATESPANEL
// ==========================
var settingsTabDuplicatesPanel = settingsTab.add("panel");
    settingsTabDuplicatesPanel.text = "duplicates";
    settingsTabDuplicatesPanel.orientation = "column";
    settingsTabDuplicatesPanel.alignChildren = ["left","top"];
    settingsTabDuplicatesPanel.spacing = 10;
    settingsTabDuplicatesPanel.margins = 10;
    settingsTabDuplicatesPanel.alignment = ["fill","top"];

var settingsTabDuplicatesPanelDistributeList_array = ["center of mass","random","closest shapes","manually"];
var settingsTabDuplicatesPanelDistributeList = settingsTabDuplicatesPanel.add("dropdownlist", undefined, settingsTabDuplicatesPanelDistributeList_array);
    settingsTabDuplicatesPanelDistributeList.selection = 1;
    settingsTabDuplicatesPanelDistributeList.text = "distribute";

// SETTINGSTABDUPLICATESPANELMANUALGROUP
// =====================================
var settingsTabDuplicatesPanelManualGroup = settingsTabDuplicatesPanel.add("group");
    settingsTabDuplicatesPanelManualGroup.orientation = "row";
    settingsTabDuplicatesPanelManualGroup.alignChildren = ["left","center"];
    settingsTabDuplicatesPanelManualGroup.spacing = 10;
    settingsTabDuplicatesPanelManualGroup.margins = 0;

var manuallyChoosingText = settingsTabDuplicatesPanelManualGroup.add("statictext");
    manuallyChoosingText.text = "Manual";

var button1 = settingsTabDuplicatesPanelManualGroup.add("button");
    button1.text = "pre";
    button1.preferredSize.width = 49;
    button1.justify = "center";

var button2 = settingsTabDuplicatesPanelManualGroup.add("button");
    button2.text = "post";
    button2.preferredSize.width = 44;
    button2.justify = "center";

// SETTINGSTABDUPLICATESPANELMANUALLYINDICESGROUP
// ==============================================
var settingsTabDuplicatesPanelManuallyIndicesGroup = settingsTabDuplicatesPanel.add("group");
    settingsTabDuplicatesPanelManuallyIndicesGroup.orientation = "row";
    settingsTabDuplicatesPanelManuallyIndicesGroup.alignChildren = ["left","center"];
    settingsTabDuplicatesPanelManuallyIndicesGroup.spacing = 10;
    settingsTabDuplicatesPanelManuallyIndicesGroup.margins = 0;

var settingsTabDuplicatesPanelManuallyIndicesText = settingsTabDuplicatesPanelManuallyIndicesGroup.add("statictext");
    settingsTabDuplicatesPanelManuallyIndicesText.text = "Indices";

// SETTINGSTABLAYERSPANEL
// ======================
var settingsTabLayersPanel = settingsTab.add("panel");
    settingsTabLayersPanel.text = "Layers";
    settingsTabLayersPanel.orientation = "row";
    settingsTabLayersPanel.alignChildren = ["left","top"];
    settingsTabLayersPanel.spacing = 10;
    settingsTabLayersPanel.margins = 10;
    settingsTabLayersPanel.alignment = ["fill","top"];

// GROUP1
// ======
var group1 = settingsTabLayersPanel.add("group");
    group1.orientation = "column";
    group1.alignChildren = ["left","center"];
    group1.spacing = 10;
    group1.margins = 0;

var settingsTabLayersPanelExpandText = group1.add("statictext");
    settingsTabLayersPanelExpandText.text = "Expand";

var settingsTabLayersPanelDeleteRadioButton = group1.add("radiobutton");
    settingsTabLayersPanelDeleteRadioButton.text = "delete";
    settingsTabLayersPanelDeleteRadioButton.value = true;

var settingsTabLayersPanelDisableRadioButton = group1.add("radiobutton");
    settingsTabLayersPanelDisableRadioButton.text = "disable";

var settingsTabLayersPanelExpandNoRadioButton = group1.add("radiobutton");
    settingsTabLayersPanelExpandNoRadioButton.text = "no";

// GROUP2
// ======
var group2 = settingsTabLayersPanel.add("group");
    group2.orientation = "column";
    group2.alignChildren = ["left","center"];
    group2.spacing = 10;
    group2.margins = 0;

var statictext1 = group2.add("statictext");
    statictext1.text = "Shrink";

var settingsTabLayersPanelRestoreRadioButton = group2.add("radiobutton");
    settingsTabLayersPanelRestoreRadioButton.text = "restore";
    settingsTabLayersPanelRestoreRadioButton.value = true;

var settingsTabLayersPanelKeepRadioButton = group2.add("radiobutton");
    settingsTabLayersPanelKeepRadioButton.text = "keep";

var settingsTabLayersPanelShrinkNoRadioButton = group2.add("radiobutton");
    settingsTabLayersPanelShrinkNoRadioButton.text = "no";

// SETTINGSTABMORPHINGTIMEPANEL
// ============================
var settingsTabMorphingTimePanel = settingsTab.add("panel");
    settingsTabMorphingTimePanel.text = "morphing time";
    settingsTabMorphingTimePanel.orientation = "column";
    settingsTabMorphingTimePanel.alignChildren = ["left","center"];
    settingsTabMorphingTimePanel.spacing = 10;
    settingsTabMorphingTimePanel.margins = 10;
    settingsTabMorphingTimePanel.alignment = ["fill","top"];

// GROUP3
// ======
var group3 = settingsTabMorphingTimePanel.add("group");
    group3.orientation = "row";
    group3.alignChildren = ["center","center"];
    group3.spacing = 10;
    group3.margins = 0;

var settingsTabMorphingTimePanelText = group3.add("statictext");
    settingsTabMorphingTimePanelText.text = "Time:";

var settingsTabMorphingTimePanelEditText = group3.add("edittext");
    settingsTabMorphingTimePanelEditText.text = "0.53";
    settingsTabMorphingTimePanelEditText.preferredSize.width = 128;
    settingsTabMorphingTimePanelEditText.preferredSize.height = 23;

// GROUP4
// ======
var morphButtonGroup = win.add("group");
    morphButtonGroup.orientation = "row";
    morphButtonGroup.alignChildren = ["left","center"];
    morphButtonGroup.spacing = 10;
    morphButtonGroup.margins = 0;

var morphButton = morphButtonGroup.add("button");
    morphButton.text = "Morph";
    morphButton.preferredSize.width = 87;
    morphButton.justify = "center";

win.center();
win.show();

// functions:
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
    for(var i=0;i<comp.selectedLayers.length;i++){
      if(comp.selectedLayers[i] instanceof ShapeLayer){
        continue;
      }else{
        alert("Select only shape layers");
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

function moveFirstVertex(path,index){
  pathValue = path.value;
  vert = pathValue.vertices;
  intan = pathValue.inTangents;
  outtan = pathValue.outTangents;
  isClosed = pathValue.closed;
  shape = new Shape();
  direc = "";
  num = 0;
  if(index == "UPPERLEFT"){
    index = upperLeftIndex(vert);
  }
  midpoint = parseInt(vert.length/2);
  if(index < midpoint){
    direc = "LEFT";
    num = index;
  }else{
    direc = "RIGHT";
    num = vert.length - index;
  }
  shape.vertices = rotateArray(vert,direc,num);
  shape.inTangents = rotateArray(intan,direc,num);
  shape.outTangents = rotateArray(outtan,direc,num);
  shape.closed = isClosed;
  path.setValue(shape);
}

function upperLeftIndex(list){
  dists = [];
  // get minx and miny:
  minx = +Infinity;
  miny = +Infinity;
  for(var i=0;i<list.length;i++){
    if(list[i][0] < minx){
      minx = list[i][0];
    }
    if(list[i][1] < miny){
      miny = list[i][1];
    }
  }
  for(var i=0;i<list.length;i++) {
  dists[i] = Math.sqrt(Math.pow(list[i][0]-minx,2)+Math.pow(list[i][1]-miny,2));
  }

  for(var i=0;i<list.length;i++) {
  dists[i] = Math.sqrt(Math.pow(list[i][0]-minx,2)+Math.pow(list[i][1]-miny,2));
  }
  minim = Math.min.apply(null,dists);
  for (var i = 0; i < dists.length; i++) {
      if (dists[i] == minim) {
        return i;
      }
  }
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

function morph(bMorph,aMorph,morphedIndices,morphedToIndices,firstVertex,morphTime){
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
    // Set the first vertex:
    switch (firstVertex) {
      case "DEFAULT":
          break;
      case "UPPERLEFT":
          //moveFirstVertex(pathProp, "UPPERLEFT");
          // moveFirstVertex(otherPathProp,"UPPERLEFT");
          break;
      case "CLOSEST":
          moveFirstVertex();
      default:
      break;
    }
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

// onclicks:
// Functionality on-clicks:
premorphTabGetSelectedButton.onClick = function(){
  selLayers = getSelectedShapeLayers();
  if(selLayers == null){
    return;
  }else{
    beforeMorph = selLayers;
    selLayersNames = "";
    for(var i=0;i<selLayers.length;i++){
      selLayersNames += selLayers[i].name;
      if(i != selLayers.length - 1){
      selLayersNames += ",";}
    }
    premorphTabSelectedLayerName.text = selLayersNames;
  }
  }

postmorphTabGetSelectedButton.onClick = function(){
  selLayers = getSelectedShapeLayers();
  if(selLayers == null){
    return;
  }else{
    afterMorph = selLayers;
    selLayersNames = "";
    for(var i=0;i<selLayers.length;i++){
      selLayersNames += selLayers[i].name;
      if(i != selLayers.length - 1){
      selLayersNames += ",";}
    }
    postmorphTabSelectedLayerName.text = selLayersNames;
  }
}

morphButton.onClick = function(){
  var morphTime =
  var fVertex = "UPPERLEFT";

  // Get distaces from upper left corner:
  bmoDist = getDistances(beforeMorph[0]);
  amoDist = getDistances(afterMorph[0]);

  // Sort indicies based on the distances:
  bmoIndices = sortIndices(bmoDist);
  amoIndices = sortIndices(amoDist);

  // Morph it!
  app.beginUndoGroup("MorphIt");
  morph(beforeMorph,afterMorph,bmoIndices,amoIndices,fVertex,morphTime);
  app.endUndoGroup();

}

// UI on-clicks:
// DEFAULT-CUSTOM BUTTONS:
// pre default-custom
premorphTabDefaultRadioButton.onClick = function(){
  premorphTabSortingDirectionPanel.enabled = false;
  premorphTabFirstVertexPanel.enabled = false;
}
premorphTabCustomRadioButton.onClick = function(){
  premorphTabSortingDirectionPanel.enabled = true;
  premorphTabFirstVertexPanel.enabled = true;
}
// post default-custom
postmorphTabDefaultRadioButton.onClick = function(){
  postmorphTabSortingDirectionPanel.enabled = false;
  postmorphTabFirstVertexPanel.enabled = false;
}
postmorphTabCustomRadioButton.onClick = function(){
  postmorphTabSortingDirectionPanel.enabled = true;
  postmorphTabFirstVertexPanel.enabled = true;
}
// settings default-custom:
settingsTabDefaultRadioButton.onClick = function(){
  settingsTabLayersPanel.enabled = false;
  settingsTabDuplicatesPanel.enabled = false;
  settingsTabMorphingTimePanel.enabled = false;
}
settingsTabCustomRadioButton.onClick = function(){
  settingsTabLayersPanel.enabled = true;
  settingsTabDuplicatesPanel.enabled = true;
  settingsTabMorphingTimePanel.enabled = true;
}

// upperLeft.onClick = function(){
//   propNum = 5;
//   layer = app.project.activeItem.selectedLayers[0];
//   oldShape = layer.property("Contents").property(propNum).property("Contents").property("Path 1").path;
//   moveFirstVertex(oldShape,"UPPERLEFT");
//}
