#targetengine dist
dist = 100;

win=new Window("palette","new project",[0,0,152,170],{resizeable:true,});
keyframed = win.add("checkbox",[42,133,120,150],"keyframe");
upleft=win.add("button",[10,35,45,55],"\\");
up=win.add("button",[50,35,100,55],"Up");
upright=win.add("button",[105,35,140,55],"/");
right=win.add("button",[105,60,140,95],"right");
down=win.add("button",[50,100,100,120],"down");
downleft=win.add("button",[10,100,45,120],"\\");
downright=win.add("button",[105,100,140,120],"/");
center=win.add("button",[50,60,100,95],"Center");
left=win.add("button",[10,60,45,95],"Left");
distance=win.add("button",[40,7,110,27],"distance");
win.center();
win.show();

var easeIn = new KeyframeEase(0, 75);
var easeOut = new KeyframeEase(0, 75);

up.onClick = function(){
  var selectedLayers = app.project.activeItem.selectedLayers;
  for(var i=0;i<selectedLayers.length;i++){
    var pos = selectedLayers[i].transform.position;
    if(keyframed.value){
      pos.setValueAtTime(app.project.activeItem.time,[pos.value[0],pos.value[1]-dist,0]);
      pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
    }
    else{
    pos.setValue([pos.value[0],pos.value[1]-dist,0]);
    }
  }
}
down.onClick = function(){

  var selectedLayers = app.project.activeItem.selectedLayers;
  for(var i=0;i<selectedLayers.length;i++){
    var pos = selectedLayers[i].transform.position;
    if(keyframed.value){
      pos.setValueAtTime(app.project.activeItem.time,[pos.value[0],pos.value[1]+dist,0]);
      pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
    }
    else{
    pos.setValue([pos.value[0],pos.value[1]+dist,0]);
  }
}
}
upleft.onClick = function(){

  var selectedLayers = app.project.activeItem.selectedLayers;
  for(var i=0;i<selectedLayers.length;i++){
    var pos = selectedLayers[i].transform.position;
    if(keyframed.value){
      pos.setValueAtTime(app.project.activeItem.time,[pos.value[0]-dist,pos.value[1]-dist,0]);
      pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
    }
    else{
    pos.setValue([pos.value[0]-dist,pos.value[1]-dist,0]);
  }
}
}
downleft.onClick = function(){

  var selectedLayers = app.project.activeItem.selectedLayers;
  for(var i=0;i<selectedLayers.length;i++){
    var pos = selectedLayers[i].transform.position;
    if(keyframed.value){
      pos.setValueAtTime(app.project.activeItem.time,[pos.value[0]-dist,pos.value[1]+dist,0]);
      pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
    }
    else{
    pos.setValue([pos.value[0]-dist,pos.value[1]+dist,0]);
  }
}
}
upright.onClick = function(){

  var selectedLayers = app.project.activeItem.selectedLayers;
  for(var i=0;i<selectedLayers.length;i++){
    var pos = selectedLayers[i].transform.position;
    if(keyframed.value){
      pos.setValueAtTime(app.project.activeItem.time,[pos.value[0]+dist,pos.value[1]-dist,0]);
      pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
    }
    else{
    pos.setValue([pos.value[0]+dist,pos.value[1]-dist,0]);
  }
}
}
downright.onClick = function(){

  var selectedLayers = app.project.activeItem.selectedLayers;
  for(var i=0;i<selectedLayers.length;i++){
    var pos = selectedLayers[i].transform.position;
    if(keyframed.value){
      pos.setValueAtTime(app.project.activeItem.time,[pos.value[0]+dist,pos.value[1]+dist,0]);
      pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
    }
    else{
    pos.setValue([pos.value[0]+dist,pos.value[1]+dist,0]);
  }
}
}
center.onClick = function(){

  var selectedLayers = app.project.activeItem.selectedLayers;
  for(var i=0;i<selectedLayers.length;i++){
    var pos = selectedLayers[i].transform.position;
    if(keyframed.value){
      pos.setValueAtTime(app.project.activeItem.time,[app.project.activeItem.width/2,app.project.activeItem.height/2,0]);
      pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
    }
    else{
    pos.setValue([app.project.activeItem.width/2,app.project.activeItem.height/2,0]);
  }
}
}
left.onClick = function(){

  var selectedLayers = app.project.activeItem.selectedLayers;
  for(var i=0;i<selectedLayers.length;i++){
    var pos = selectedLayers[i].transform.position;
    if(keyframed.value){
      pos.setValueAtTime(app.project.activeItem.time,[pos.value[0]-dist,pos.value[1],0]);
      pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
    }
    else{
      pos.setValue([pos.value[0]-dist,pos.value[1],0]);
    }
  }
}
right.onClick = function(){

  var selectedLayers = app.project.activeItem.selectedLayers;
  for(var i=0;i<selectedLayers.length;i++){
    var pos = selectedLayers[i].transform.position;
    if(keyframed.value){
    pos.setValueAtTime(app.project.activeItem.time,[pos.value[0]+dist,pos.value[1],0]);
    pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
    }
    else{
      pos.setValue([pos.value[0]+dist,pos.value[1],0]);
    }
  }
}
distance.onClick = function(){

var gimmedist = prompt("Enter a new dist value: ",100);
gimmedist = eval(gimmedist);
dist = gimmedist;
}
