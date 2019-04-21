#targetengine timeShift
timeShift = 1;
var comp = app.project.activeItem;
alert(comp.duration);

win=new Window("palette","Set Time",[0,0,175,120],{resizeable:true,});
left=win.add("button",[15,31,44,86],"<-");
right=win.add("button",[127,32,156,87],"->");
time=win.add("button",[54,42,116,78],"Set");
win.center();
win.show();

left.onClick = function(){
  if(comp.time > timeShift){
    comp.time = comp.time - timeShift;
  }else{
    alert("Sorry, can't do that");
  }
}
right.onClick = function(){
  if(comp.time+timeShift > comp.duration){
    alert("sorry mate!");
  }else{
    comp.time = comp.time + timeShift;
  }
}
time.onClick = function(){
  var newTimeShift = prompt("Enter the new time shift: ",1);
  newTimeShift = eval(newTimeShift);
  timeShift = newTimeShift;
}
