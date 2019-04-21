#targetengine dist,scaleFactor
dist = 100;
scaleFactor = 50;

var easeIn = new KeyframeEase(0, 75);
var easeOut = new KeyframeEase(0, 75);

win=new Window("palette","MoveIt",[0,0,160,360],{resizeable:false});
showStuff = win.add("button",[42,190,120,220],"Show It");
hideStuff = win.add("button",[42,225,120,255],"Hide It");
scaleItButton = win.add("button",[42,270,120,300],"Scale It");
scaleItDown = win.add("button",[12,270,38,300],"-");
scaleItUp = win.add("button",[124,270,150,300],"+");
bongIt = win.add("button",[42,305,120,335],"Bong It");
keyframed = win.add("checkbox",[42,133,120,150],"keyframe");
groupChecked = win.add("checkbox",[42,155,120,170],"group");
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

function moveIt(direction){
  var commands = {
    "up": [0,-dist],
    "down": [0,dist],
    "upleft": [-dist,-dist],
    "downleft": [-dist,dist],
    "upright": [dist,-dist],
    "downright": [dist,dist],
    "left":[-dist,0],
    "right":[dist,0]
  };
  app.beginUndoGroup("Move It");
  if(!groupChecked.value){
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      var pos = selectedLayers[i].transform.position;
      if(keyframed.value){
        pos.setValueAtTime(app.project.activeItem.time,[pos.value[0]+commands[direction][0],pos.value[1]+commands[direction][1],0]);
        pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
      }
      else{
        pos.setValue([pos.value[0]+commands[direction][0],pos.value[1]+commands[direction][1],0]);
      }
    }
  }else{
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      for(var j=1;j<selectedLayers[i].property("Contents").numProperties+1;j++){
        var group = selectedLayers[i].property("Contents").property(j);
        if(group.selected){
          var posit = selectedLayers[i].property("Contents").property(j).transform.position;
          if(keyframed.value){
            posit.setValueAtTime(app.project.activeItem.time,[posit.value[0]+commands[direction][0],posit.value[1]+commands[direction][1]]);
            posit.setTemporalEaseAtKey(posit.numKeys, [easeIn], [easeOut]);
          }
          else{
            posit.setValue([posit.value[0]+commands[direction][0],posit.value[1]+commands[direction][1]]);
          }
        }
      }
    }
  }
  app.endUndoGroup();
}

function showOrHide(isShow,timeInterval){
   var layers = app.project.activeItem.selectedLayers;
   if(!groupChecked.value){
     for(var i=0;i<layers.length;i++){
       layers[i].transform.opacity.setValueAtTime(app.project.activeItem.time,isShow?0:100);
       layers[i].transform.opacity.setValueAtTime(app.project.activeItem.time+timeInterval,isShow?100:0);
     }
   }
}

function scaleIt(direction){
  var commands = {
    "Up": scaleFactor,
    "Down": -scaleFactor
  };
  app.beginUndoGroup("Scale It");
  if(!groupChecked.value){
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      var pos = selectedLayers[i].transform.scale;
      if(keyframed.value){
        pos.setValueAtTime(app.project.activeItem.time,[pos.value[0]+commands[direction],pos.value[1]+commands[direction],100]);
        pos.setTemporalEaseAtKey(pos.numKeys, [easeIn,easeIn,easeIn], [easeOut,easeOut,easeOut]);
      }
      else{
        pos.setValue([pos.value[0]+commands[direction],pos.value[1]+commands[direction],100]);
      }
    }
  }else{
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      for(var j=1;j<selectedLayers[i].property("Contents").numProperties+1;j++){
        var group = selectedLayers[i].property("Contents").property(j);
        if(group.selected){
          var posit = selectedLayers[i].property("Contents").property(j).transform.scale;
          if(keyframed.value){
            posit.setValueAtTime(app.project.activeItem.time,[posit.value[0]+commands[direction],posit.value[1]+commands[direction]]);
            posit.setTemporalEaseAtKey(posit.numKeys, [easeIn,easeIn,easeIn], [easeOut,easeOut,easeOut]);
          }
          else{
            posit.setValue([posit.value[0]+commands[direction],posit.value[1]+commands[direction]]);
          }
        }else{
          alert("No group is selected!");
        }
      }
    }
  }
  app.endUndoGroup();
}

function keyFrameIt(){
  var comp = app.project.activeItem;
  var selectedLayers = comp.selectedLayers;
  if(!groupChecked.value){
    for(var i=0;i<selectedLayers.length;i++){
      var currLayer = selectedLayers[i];

    }
  }
}

keyFrameItButton.onClick = function(){
  var c = confirm("Do you want Keyfram Ease?",false,"Keyframe Ease");
}

up.onClick = function(){
moveIt("up");
}

down.onClick = function(){
moveIt("down");
}

upleft.onClick = function(){
moveIt("upleft");
}

downleft.onClick = function(){
moveIt("downleft");
}

upright.onClick = function(){
moveIt("upright");
}

downright.onClick = function(){
moveIt("downright");
}

left.onClick = function(){
moveIt("left");
}

right.onClick = function(){
moveIt("right");
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

distance.onClick = function(){
var gimmedist = prompt("Enter a new dist value: ",100);
gimmedist = eval(gimmedist);
dist = gimmedist;
}

showStuff.onClick = function(){
  var timeInterval = prompt("Enter the time interval",1);
  showOrHide(true,timeInterval);
}

hideStuff.onClick = function(){
  var timeInterval = prompt("Enter the time interval",1);
  showOrHide(false,timeInterval);
}

scaleItButton.onClick = function(){
  var comp = app.project.activeItem;
  var addScale = prompt("Add scale: ",50);
  addScale = eval(addScale);
  var scaleTime = prompt("Scale time: ",0.5);
  scaleTime = eval(scaleTime);
  var selLayers = comp.selectedLayers;
  for(var i=0;i<selLayers.length;i++){
    var currScale = selLayers[i].transform.scale;
    var scaleValue = currScale.value[0];
    currScale.setValueAtTime(comp.time,currScale.value);
    currScale.setTemporalEaseAtKey(currScale.numKeys,[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]);
    currScale.setValueAtTime(comp.time+scaleTime,[scaleValue+addScale,scaleValue+addScale,100]);
    currScale.setTemporalEaseAtKey(currScale.numKeys,[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]);
  }
}

scaleItUp.onClick = function(){
  scaleIt("Up");
}
scaleItDown.onClick = function(){
  scaleIt("Down");
}

bongIt.onClick = function(){
  app.beginUndoGroup("BongIt");

  var comp = app.project.activeItem;
  var layers = comp.selectedLayers;

  var bongTime = prompt("Enter the bong time",1.2);
  bongTime = parseFloat(bongTime);
  var bongSize = prompt("Enter the bong size",50);
  bongSize = parseFloat(bongSize);

  for(var i = 0;i<layers.length;i++){
      var currScale = layers[i].transform.scale;
      var timeNow = app.project.activeItem.time;
      scaleValue = currScale.value[0];

      currScale.setValueAtTime(timeNow,[scaleValue,scaleValue,100]);
      currScale.setTemporalEaseAtKey(currScale.numKeys,[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]);

      currScale.setValueAtTime(timeNow+bongTime/2,[scaleValue+bongSize,scaleValue+bongSize,100]);
      currScale.setTemporalEaseAtKey(currScale.numKeys,[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]);

      currScale.setValueAtTime(timeNow+bongTime,[scaleValue,scaleValue,100]);
      currScale.setTemporalEaseAtKey(currScale.numKeys,[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]);
  }
  app.endUndoGroup();
}
