#targetengine seco
seco = 0;

// Set the date we're counting down to
var countDownDate = new Date("Jan 5, 2021 15:37:25").getTime();
var now = new Date().getTime();
var distance = countDownDate - now;

var days = Math.floor(distance / (1000 * 60 * 60 * 24));
var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
var seconds = Math.floor((distance % (1000 * 60)) / 1000);

alert("Test here");

var now2 = new Date().getTime();

alert((now2-now)/1000);


function pointClicked(){
  // How to detect actions in after effects: Once clicked
  while(true){
    if(pointClicked){
      var pointClickedTime = getCurrTime();
      break;
    }
  }
  return pointClickedTime;
}

function getCurrTime(){
  var currTimeInSeconds = new Date().getTime() / 1000;
  return currTimeInSeconds;
}
