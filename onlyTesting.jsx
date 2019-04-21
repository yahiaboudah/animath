var a = "//23 var kaz";
var str = "";
for(var i=2;i<a.length;i++){
  str += a[i];
  if(a[i] == 'v'){
    break;
  }
}
alert(parseInt(str));
