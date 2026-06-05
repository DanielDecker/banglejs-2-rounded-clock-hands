  let Clockwork = require('https://raw.githubusercontent.com/rozek/banglejs-2-simple-clockwork/main/Clockwork.js');

  Clockwork.windUp({
    face: require('https://raw.githubusercontent.com/rozek/banglejs-2-four-numbered-clock-face/main/ClockFace.js'),
    hands:require('https://raw.githubusercontent.com/DanielDecker/banglejs-2-rounded-clock-hands/main/ClockHands.js'),
  },{
    Foreground:'#000000', Background:'#FFFFFF', Seconds:'#FF0000'
  });
