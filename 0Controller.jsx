#targetengine distanceValue,scaleFactorValue,opacityFactorValue,cursorSpacingValue
distanceValue = 100;
scaleFactorValue = 50;
opacityFactorValue = 20;
cursorSpacingValue = 2;

var easeIn = new KeyframeEase(0, 75);
var easeOut = new KeyframeEase(0, 75);

win=new Window("palette","Controller",[0,0,450,375],{resizeable:false});
positionPanel=win.add("panel",[23,30,223,188],"Position");
distanceButton=positionPanel.add("button",[58,7,134,27],"Distance");
upButton=positionPanel.add("button",[60,35,130,55],"↑");
downButton=positionPanel.add("button",[60,90,130,110],"↓");
leftButton=positionPanel.add("button",[37,58,57,88],"←");
rightButton=positionPanel.add("button",[132,58,152,88],"→");
centerButton=positionPanel.add("button",[60,58,130,87],"Center");
upleft=positionPanel.add("button",[37,35,57,55],"←↑");
upright=positionPanel.add("button",[132,35,152,55],"↑→");
downleft=positionPanel.add("button",[37,90,57,110],"←↓");
downright=positionPanel.add("button",[132,90,152,110],"↓→");
keyframeItPosition=positionPanel.add("button",[35,120,85,140],"KF IT!");
groupCheckedPosition=positionPanel.add("checkbox",[105,123,175,143],"group");
groupCheckedPosition.value=0
scalePanel=win.add("panel",[23,195,223,340],"Scale");
scaleFactorButton=scalePanel.add("button",[50,23,140,58],"scaleFactor");
plusScaleButton=scalePanel.add("button",[145,23,180,58],"+");
minusScaleButton=scalePanel.add("button",[11,23,46,58],"-");
keyFrameItScale=scalePanel.add("button",[35,70,85,90],"KF IT!");
groupCheckedScale=scalePanel.add("checkbox",[105,73,175,93],"group");
groupCheckedScale.value=0
bongIt=scalePanel.add("button",[12,97,102,127],"Bong It!");
useColor=scalePanel.add("checkbox",[112,105,212,125],"Color Bong");
useColor.value=0
opacityPanel=win.add("panel",[235,30,435,188],"Opacity");
opacityFactorButton=opacityPanel.add("button",[50,23,140,58],"opacityFactor");
plusOpacityButton=opacityPanel.add("button",[145,23,180,58],"+");
minusOpacityButton=opacityPanel.add("button",[11,23,46,58],"-");
keyFrameItOpacity=opacityPanel.add("button",[35,70,85,90],"KF IT!");
groupCheckedOpacity=opacityPanel.add("checkbox",[105,73,175,93],"group");
groupCheckedOpacity.value=0
showOpacityButton=opacityPanel.add("button",[12,103,92,133],"Show It!");
hideOpacityButton=opacityPanel.add("button",[101,103,181,133],"Hide It!");
cursorPanel=win.add("panel",[235,195,435,340],"Cursor");
cursorSpacingButton=cursorPanel.add("button",[50,50,140,85],"spacingSize");
moveCursorRightButton=cursorPanel.add("button",[145,50,180,85],"→");
moveCursorLeftButton=cursorPanel.add("button",[11,50,46,85],"←");
win.center();
win.show();


/*--------------------------------------
--------Start Position Stuff------------
---------------------------------------*/

function moveIt(direction){
  var commands = {
    "up": [0,-distanceValue],
    "down": [0,distanceValue],
    "upleft": [-distanceValue,-distanceValue],
    "downleft": [-distanceValue,distanceValue],
    "upright": [distanceValue,-distanceValue],
    "downright": [distanceValue,distanceValue],
    "left":[-distanceValue,0],
    "right":[distanceValue,0]
  };
  app.beginUndoGroup("Move It");
  if(!groupCheckedPosition.value){
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      var pos = selectedLayers[i].transform.position;
      if(pos.numKeys > 0){
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
          if(posit.numKeys>0){
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

function scaleIt(direction){
  var commands = {
    "up": scaleFactorValue,
    "down": -scaleFactorValue
  };
  app.beginUndoGroup("Move It");
  if(!groupCheckedScale.value){
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      var pos = selectedLayers[i].transform.scale;
      if(pos.numKeys > 0){
        pos.setValueAtTime(app.project.activeItem.time,[pos.value[0]+commands[direction],pos.value[1]+commands[direction],0]);
        pos.setTemporalEaseAtKey(pos.numKeys, [easeIn,easeIn,easeIn], [easeOut,easeOut,easeOut]);
      }
      else{
        pos.setValue([pos.value[0]+commands[direction],pos.value[1]+commands[direction],0]);
      }
    }
  }else{
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      for(var j=1;j<selectedLayers[i].property("Contents").numProperties+1;j++){
        var group = selectedLayers[i].property("Contents").property(j);
        if(group.selected){
          var posit = selectedLayers[i].property("Contents").property(j).transform.scale;
          if(posit.numKeys>0){
            posit.setValueAtTime(app.project.activeItem.time,[posit.value[0]+commands[direction],posit.value[1]+commands[direction]]);
            posit.setTemporalEaseAtKey(posit.numKeys, [easeIn,easeIn], [easeOut,easeOut]);
          }
          else{
            posit.setValue([posit.value[0]+commands[direction],posit.value[1]+commands[direction]]);
          }
        }
      }
    }
  }
  app.endUndoGroup();
}

function showIt(direction){
  var commands = {
    "up": opacityFactorValue,
    "down": -opacityFactorValue
  };
  app.beginUndoGroup("Show It");
  if(!groupCheckedOpacity.value){
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      var pos = selectedLayers[i].transform.opacity;
      if(pos.numKeys > 0){
        pos.setValueAtTime(app.project.activeItem.time,pos.value+commands[direction]);
      }
      else{
        pos.setValue(pos.value+commands[direction]);
      }
    }
  }else{
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      for(var j=1;j<selectedLayers[i].property("Contents").numProperties+1;j++){
        var group = selectedLayers[i].property("Contents").property(j);
        if(group.selected){
          var posit = selectedLayers[i].property("Contents").property(j).transform.opacity;
          if(posit.numKeys>0){
            posit.setValueAtTime(app.project.activeItem.time,posit.value+commands[direction]);
          }
          else{
            posit.setValue(posit.value+commands[direction]);
          }
        }
      }
    }
  }
  app.endUndoGroup();
}



upButton.onClick = function(){
moveIt("up");
}

downButton.onClick = function(){
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

leftButton.onClick = function(){
moveIt("left");
}

rightButton.onClick = function(){
moveIt("right");
}

centerButton.onClick = function(){
  var selectedLayers = app.project.activeItem.selectedLayers;
  if(groupCheckedPosition.value){
    for(var i=0;i<selectedLayers.length;i++){
      for(var j=1;j<selectedLayers[i].property("Contents").numProperties+1;j++){
        var group = selectedLayers[i].property("Contents").property(j);
        if(group.selected){
          var posit = selectedLayers[i].property("Contents").property(j).transform.position;
          if(posit.numKeys>0){
            posit.setValueAtTime(app.project.activeItem.time,[0,0]);
            posit.setTemporalEaseAtKey(posit.numKeys, [easeIn], [easeOut]);
          }
          else{
            posit.setValue([0,0]);
          }
        }
      }
    }
  }else{
    for(var i=0;i<selectedLayers.length;i++){
      var pos = selectedLayers[i].transform.position;
      if(pos.numKeys > 0){
        pos.setValueAtTime(app.project.activeItem.time,[app.project.activeItem.width/2,app.project.activeItem.height/2,0]);
        pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
      }
      else{
        pos.setValue([app.project.activeItem.width/2,app.project.activeItem.height/2,0]);
      }
    }
}
}

distanceButton.onClick = function(){
var gimmedist = prompt("Enter a new distance value: ",100);
gimmedist = eval(gimmedist);
distanceValue = gimmedist;
}

keyframeItPosition.onClick = function(){
  app.beginUndoGroup("KeyFrame Its Position");
  if(!groupCheckedPosition.value){
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      var pos = selectedLayers[i].transform.position;
        pos.setValueAtTime(app.project.activeItem.time,[pos.value[0],pos.value[1],0]);
        pos.setTemporalEaseAtKey(pos.numKeys, [easeIn], [easeOut]);
  }
  }else{
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      for(var j=1;j<selectedLayers[i].property("Contents").numProperties+1;j++){
        var group = selectedLayers[i].property("Contents").property(j);
        if(group.selected){
            var posit = selectedLayers[i].property("Contents").property(j).transform.position;
            posit.setValueAtTime(app.project.activeItem.time,[posit.value[0],posit.value[1]]);
            posit.setTemporalEaseAtKey(posit.numKeys, [easeIn], [easeOut]);
          }
        }
      }
    }
    app.endUndoGroup();
}

/*-------------------------------------
---------- End Position Stuff----------
-------------------------------------*/

/*-------------------------------------
---------- Start Scale Stuff----------
-------------------------------------*/

scaleFactorButton.onClick = function(){
  var scaleFactorPrompt = prompt("Enter a scale factor: ",scaleFactorValue);
  scaleFactorPrompt = eval(scaleFactorPrompt);
  scaleFactorValue = scaleFactorPrompt;
}

plusScaleButton.onClick = function(){
scaleIt("up");
}
minusScaleButton.onClick = function(){
scaleIt("down");
}

keyFrameItScale.onClick = function(){
  app.beginUndoGroup("KeyFrame Its Position");
  if(!groupCheckedScale.value){
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
        var pos = selectedLayers[i].transform.scale;
        pos.setValueAtTime(app.project.activeItem.time,[pos.value[0],pos.value[1],100]);
        pos.setTemporalEaseAtKey(pos.numKeys, [easeIn,easeIn,easeIn], [easeOut,easeOut,easeOut]);
  }
  }else{
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      for(var j=1;j<selectedLayers[i].property("Contents").numProperties+1;j++){
        var group = selectedLayers[i].property("Contents").property(j);
        if(group.selected){
            var posit = selectedLayers[i].property("Contents").property(j).transform.scale;
            posit.setValueAtTime(app.project.activeItem.time,[posit.value[0],posit.value[1]]);
            posit.setTemporalEaseAtKey(posit.numKeys, [easeIn,easeIn], [easeOut,easeIn]);
        }
      }
    }
  }
  app.endUndoGroup();
}
bongIt.onClick = function(){

  app.beginUndoGroup("BongIt");

  var comp = app.project.activeItem;
  var selectedLayers = comp.selectedLayers;

  if(useColor.value){
    var hexColor = $.colorPicker();
    var r = hexColor >> 16;
    var g = (hexColor & 0x00ff00) >> 8;
    var b = hexColor & 0xff;
    r/=255;g/=255;b/=255;
    var c2 = [r,g,b,1];
  }

  var bongTime = prompt("Enter the bong time",0.7);
  bongTime = parseFloat(bongTime);

  var bongSize = prompt("Enter the bong size",35);
  bongSize = parseFloat(bongSize);

  if(groupCheckedScale.value){
    for(var h=0;h<selectedLayers.length;h++){
    var item = selectedLayers[h].property("Contents");
    for(var i =1;i<item.numProperties+1;i++){
      var group = item.property(i);
      if(group.selected){
        var scaleProp = group.transform.scale;
        scaleProp.setValueAtTime(comp.time,[scaleProp.value[0],scaleProp.value[1]]);
        scaleProp.setTemporalEaseAtKey(scaleProp.numKeys,[easeIn,easeIn],[easeOut,easeOut]);
        scaleProp.setValueAtTime(comp.time+bongTime,[scaleProp.value[0]+bongSize,scaleProp.value[1]+bongSize]);
        scaleProp.setTemporalEaseAtKey(scaleProp.numKeys,[easeIn,easeIn],[easeOut,easeOut]);
        scaleProp.setValueAtTime(comp.time+2*bongTime,[scaleProp.value[0],scaleProp.value[1]]);
        scaleProp.setTemporalEaseAtKey(scaleProp.numKeys,[easeIn,easeIn],[easeOut,easeOut]);
        if(useColor.value){
          var c1 = group.property("Contents").property("Fill 1").property("Color").value;
          group.property("Contents").property("Fill 1").property("Color").setValueAtTime(comp.time,c1);
          group.property("Contents").property("Fill 1").property("Color").setValueAtTime(comp.time+bongTime,c2);
          group.property("Contents").property("Fill 1").property("Color").setValueAtTime(comp.time+2*bongTime,c1);
        }
      }
    }
  }
  }else{
    for(var i=0;i<selectedLayers.length;i++){
      if(useColor.value){
        if(selectedLayers[i].property("Effects").property("Fill") == null){
          var fillProp = selectedLayers[i].property("Effects").addProperty("Fill");
        }else{
          var fillProp = selectedLayers[i].property("Effects").property("Fill");
        }
        var colorProp = fillProp.property("Color");
        colorProp.setValueAtTime(comp.time,c2);
        colorProp.setValueAtTime(comp.time+2*bongTime,c2);
        fillProp.property("Compositing Options").property("Effect Opacity").setValueAtTime(comp.time,0);
        fillProp.property("Compositing Options").property("Effect Opacity").setValueAtTime(comp.time+bongTime,100);
        fillProp.property("Compositing Options").property("Effect Opacity").setValueAtTime(comp.time+2*bongTime,0);
      }
    var scaleProp = selectedLayers[i].transform.scale;
    scaleProp.setValueAtTime(comp.time,[scaleProp.value[0],scaleProp.value[1],100]);
    scaleProp.setTemporalEaseAtKey(scaleProp.numKeys,[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]);
    scaleProp.setValueAtTime(comp.time+bongTime,[scaleProp.value[0]+bongSize,scaleProp.value[1]+bongSize,100]);
    scaleProp.setTemporalEaseAtKey(scaleProp.numKeys,[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]);
    scaleProp.setValueAtTime(comp.time+2*bongTime,[scaleProp.value[0],scaleProp.value[1],100]);
    scaleProp.setTemporalEaseAtKey(scaleProp.numKeys,[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]);
  }
}
  app.endUndoGroup();
}
/*-----------------------------------------------
---------End Scale Stuff ------------------------
------------------------------------------------*/

/*-------------------------------------------
--------Start Opacity Stuff-----------------
-------------------------------------------*/


opacityFactorButton.onClick = function(){
  var opacityFactorPrompt = prompt("Enter an opacity factor: ",opacityFactorValue);
  opacityFactorPrompt = eval(opacityFactorPrompt);
  opacityFactorValue = opacityFactorPrompt;
}

plusOpacityButton.onClick = function(){
showIt("up");
}
minusOpacityButton.onClick = function(){
showIt("down");
}

keyFrameItOpacity.onClick = function(){
  app.beginUndoGroup("KeyFrame Its Opacity");
  if(!groupCheckedOpacity.value){
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
        var pos = selectedLayers[i].transform.opacity;
        pos.setValueAtTime(app.project.activeItem.time,pos.value);
 }
 }else{
    var selectedLayers = app.project.activeItem.selectedLayers;
    for(var i=0;i<selectedLayers.length;i++){
      for(var j=1;j<selectedLayers[i].property("Contents").numProperties+1;j++){
        var group = selectedLayers[i].property("Contents").property(j);
        if(group.selected){
            var posit = selectedLayers[i].property("Contents").property(j).transform.opacity;
            posit.setValueAtTime(app.project.activeItem.time,posit.value);
        }
      }
    }
  }
  app.endUndoGroup();
}
showOpacityButton.onClick = function(){

}

/*-------------------------------------------
-------End Opacity Stuff--------------------
------------------------------------------*/


/*-----Start Cursor Stuff -----------*/
cursorSpacingButton.onClick = function(){
  var spacingValPrompt = prompt("Enter the spacing value: ",cursorSpacingValue);
  spacingValPrompt = eval(spacingValPrompt);
  cursorSpacingValue = spacingValPrompt;
}
moveCursorRightButton.onClick = function(){
  var comp = app.project.activeItem;
  comp.time = comp.time + cursorSpacingValue;
}
moveCursorLeftButton.onClick = function(){
  var comp = app.project.activeItem;
  comp.time = comp.time - cursorSpacingValue;
}
