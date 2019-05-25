#targetengine beforeMorph, afterMorph
beforeMorph = [];
afterMorph = [];

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

function getPathProps(group){
  var indicies = [];
  for(var i=1;i<group.property("Contents").numProperties+1;i++){
    var x = group.property("Contents").property(i);
    if(x.name.indexOf("Path") != -1){
      indicies[indicies.length] = i;
    }
  }
  return indicies;
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
    for(var j=1;j<beforeMorph[0].property("Contents").numProperties+1;j++){
      var group = beforeMorph[0].property("Contents").property(j);
      var ind = getPathProps(group);
      for(var i=0;i<ind.length;i++){
        num = parseInt(ind[i]);
        var pathProp = group.property("Contents").property(num).path;
        pathProp.setValueAtTime(7,pathProp.value);
      }
  }
}
